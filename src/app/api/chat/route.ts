// import { NextRequest } from "next/server";

// export const runtime = "edge";

// export async function POST(request: NextRequest) {
//   const { model, message } = await request.json();
//   const modelName: string = model.split(":")[0];

//   console.log("model:", modelName);
//   console.log("message:", message);

//   // Validate input
//   if (!message || !model) {
//     return new Response(
//       JSON.stringify({ error: "Message and model are required" }),
//       {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }

//   const streamResponse = new ReadableStream({
//     async start(controller) {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
//           {
//             method: "POST",
//             body: JSON.stringify({
//               model: modelName,
//               // Fixed typo in 'prompt'
//               prompt: message,
//               // Enable streaming since we're using ReadableStream
//               stream: false,
//             }),
//             headers: {
//               "Content-Type": "application/json",
//             },
//           },
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         if (!response.body) {
//           throw new Error("No response body");
//         }

//         console.log("response:", response.body);
//       } catch (error) {
//         console.error("Error in stream:", error);
//         controller.error(error);
//       }
//     },
//   });

//   return new Response(streamResponse, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache, no-transform",
//       Connection: "keep-alive",
//       "Transfer-Encoding": "chunked",
//     },
//   });
// }

import { createOllama } from "ollama-ai-provider";
import { streamText } from "ai";

const ollama = createOllama();

export async function POST(req: Request) {
  const message = await req.json();

  const { messages, model } = message;

  const result = await streamText({
    model: ollama(model),
    messages: messages,
  });

  return result.toDataStreamResponse();
}
