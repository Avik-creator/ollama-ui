// app/api/chat/route.ts
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { model, message } = await request.json();

  const streamResponse = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
          {
            method: "POST",
            body: JSON.stringify({ model, message, stream: true }),
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(decoder.decode(value));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(streamResponse, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
