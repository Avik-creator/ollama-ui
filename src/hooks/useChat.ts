import { useState } from "react";
import { useSettings } from "@/context/LayoutProvider";
import { useToast } from "./use-toast";

interface Message {
  role: "user" | "assistant";
  message: string;
}

interface ChatState {
  streaming: boolean;
  loading: boolean;
  error: boolean;
  message: string;
}

// interface StreamChunk {
//   [key: string]: string; // For handling numbered keys like "0"
//   e?: {
//     finishReason: string;
//     usage: {
//       promptTokens: number;
//       completionTokens: number;
//     };
//     isContinued: boolean;
//   };
//   d?: {
//     finishReason: string;
//     usage: {
//       promptTokens: number;
//       completionTokens: number;
//     };
//   };
// }

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    streaming: false,
    loading: false,
    error: false,
    message: "",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingAnswer, setStreamingAnswer] = useState<string>("");
  const { settings } = useSettings();
  const { toast } = useToast();

  // const processStreamChunk = (chunk: StreamChunk): string => {
  //   // Filter out the metadata properties (e and d)
  //   const textChunks = Object.entries(chunk)
  //     .filter(([key]) => key !== "e" && key !== "d")
  //     .map(([_, value]) => value)
  //     .join("");

  //   return textChunks;
  // };

  const sendMessage = async (content: string) => {
    if (settings.model === "") {
      toast({
        description: "Kindly choose a model first.",
      });
      return;
    }

    try {
      setMessages((prev) => [...prev, { role: "user", message: content }]);
      setChatState((prev) => ({ ...prev, loading: true, streaming: true }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: settings.model,
          message: content,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      console.log("response:", response.body);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let accumulatedResponse = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // *** This is the key change ***
        // Extract the actual message from the chunk using a regular expression
        const cleanChunk = chunk.replace(
          /finishReason.*|usage.*|isContinued.*|promptTokens.*|completionTokens.*/g,
          "",
        );

        const messageMatch = cleanChunk.match(/"([^d:{"]*)"/g);
        if (messageMatch) {
          const extractedMessage = messageMatch
            .map((m) => m.slice(1, -1))
            .join(""); // Remove quotes

          accumulatedResponse += extractedMessage;

          setStreamingAnswer(accumulatedResponse);
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", message: accumulatedResponse },
      ]);
      setStreamingAnswer("");
      setChatState((prev) => ({ ...prev, loading: false, streaming: false }));
    } catch (error) {
      setChatState((prev) => ({
        ...prev,
        error: true,
        loading: false,
        streaming: false,
      }));
      toast({
        variant: "destructive",
        description: "Apologies, unable to generate response.",
      });
    }
  };
  return {
    chatState,
    messages,
    streamingAnswer,
    sendMessage,
  };
}
