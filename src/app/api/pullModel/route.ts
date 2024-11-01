// app/api/pull/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, insecure = false, stream = true } = await request.json();

    // Sending the request to Ollama's pull endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/pull`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, insecure, stream }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to initiate model download");
    }

    // Stream the response back to the client if streaming is enabled
    if (stream) {
      const streamResponse = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder("utf-8");

          if (!reader) {
            controller.close();
            return;
          }

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value);
              controller.enqueue(chunk);
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(streamResponse, {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // If stream is set to false, return a single JSON response after completion
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
