"use client";

import { Badge } from "@/components/ui/badge";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Paperclip, Mic, CornerDownLeft, Loader2 } from "lucide-react";
import { useSettings } from "@/context/LayoutProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import CodeDisplayBlock from "./code-block";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Please enter your message.",
  }),
});

export default function ChatBlock() {
  const { settings } = useSettings();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      model: settings.model,
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onKeyDown = event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline character
      handleSubmit();
    }
  };

  return (
    <div className="relative flex no-scrollbar h-full max-h-screen overflow-y-auto min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
      <div className="flex-1 pb-3">
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <fieldset className="flex flex-col border p-4 black-black rounded-lg mb-3">
                <legend className="-ml-1 px-1 text-sm font-medium">{message.role === "user" ? "You" : "Ollama"}</legend>
                <div className="space-y-0.5 w-full">
                  {message.role === "user" ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      {/* <ReactMarkdown>{message.content}</ReactMarkdown> */}
                      {message.content.split("```").map((part, index) => {
                        if (index % 2 === 0) {
                          return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
                        } else {
                          return (
                            <pre className="whitespace-pre-wrap" key={index}>
                              <CodeDisplayBlock code={part} />
                            </pre>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              </fieldset>
            </div>
          ))}
        </div>
      </div>
      <div className="relative w-full bottom-0">
        <Form {...form}>
          <form
            className="overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Message Ollama..."
                      className="min-h-12 resize-none border-0 p-3  shadow-none focus-visible:ring-0"
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={onKeyDown}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center p-3 pt-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach File</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Mic className="size-4" />
                    <span className="sr-only">Use Microphone</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Use Microphone</TooltipContent>
              </Tooltip>
              <Button disabled={isLoading} type="submit" size="sm" className="ml-auto gap-1.5">
                {isLoading ? "Generating response" : "Send Message"}
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CornerDownLeft className="size-3.5" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
