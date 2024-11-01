"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Paperclip, Mic, CornerDownLeft, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useChat } from "@/hooks/useChat";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Please enter your messages.",
  }),
});

function ChatBlock() {
  const { chatState, messages, streamingAnswer, sendMessage } = useChat();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    form.reset();
    await sendMessage(data.content);
  }

  // Custom styles for markdown content
  const markdownStyles = {
    p: "mb-4",
    h1: "text-2xl font-bold mb-4",
    h2: "text-xl font-bold mb-3",
    h3: "text-lg font-bold mb-2",
    ul: "list-disc pl-6 mb-4",
    ol: "list-decimal pl-6 mb-4",
    li: "mb-1",
    pre: "bg-slate-200 p-3 rounded-lg mb-4 overflow-x-auto",
    code: "bg-slate-200 px-1 py-0.5 rounded text-sm font-mono",
    blockquote: "border-l-4 border-slate-300 pl-4 mb-4 italic",
    a: "text-blue-600 hover:underline",
    strong: "font-bold",
    em: "italic",
    table: "min-w-full border-collapse mb-4",
    th: "border border-slate-300 px-4 py-2 bg-slate-100",
    td: "border border-slate-300 px-4 py-2",
  };

  return (
    <div className="relative flex no-scrollbar h-full max-h-screen overflow-y-auto min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
      <Badge variant="outline" className="absolute right-3 top-3">
        Output
      </Badge>
      <div className="flex-1 pb-3">
        <div>
          {messages.map((item, index) => (
            <div key={index}>
              <fieldset className="flex flex-col border p-4 bg-slate-100 rounded-lg mb-3">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  {item.role === "user" ? "You" : "Ollama"}
                </legend>
                <div className="space-y-0.5 w-full">
                  {item.role === "user" ? (
                    <p className="text-sm text-muted-foreground">
                      {item.message}
                    </p>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => (
                            <p className={markdownStyles.p} {...props} />
                          ),
                          h1: ({ node, ...props }) => (
                            <h1 className={markdownStyles.h1} {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className={markdownStyles.h2} {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className={markdownStyles.h3} {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className={markdownStyles.ul} {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className={markdownStyles.ol} {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className={markdownStyles.li} {...props} />
                          ),
                          pre: ({ node, ...props }) => (
                            <pre className={markdownStyles.pre} {...props} />
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code
                                className={markdownStyles.code}
                                {...props}
                              />
                            ) : (
                              <pre className={markdownStyles.pre}>
                                <code {...props} />
                              </pre>
                            ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className={markdownStyles.blockquote}
                              {...props}
                            />
                          ),
                          a: ({ node, ...props }) => (
                            <a className={markdownStyles.a} {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              className={markdownStyles.strong}
                              {...props}
                            />
                          ),
                          em: ({ node, ...props }) => (
                            <em className={markdownStyles.em} {...props} />
                          ),
                          table: ({ node, ...props }) => (
                            <table
                              className={markdownStyles.table}
                              {...props}
                            />
                          ),
                          th: ({ node, ...props }) => (
                            <th className={markdownStyles.th} {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className={markdownStyles.td} {...props} />
                          ),
                        }}
                      >
                        {item.message}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </fieldset>
            </div>
          ))}
          {chatState.streaming && (
            <fieldset className="flex flex-col border p-4 bg-slate-100 rounded-lg mb-3">
              <legend className="-ml-1 px-1 text-sm font-medium">Ollama</legend>
              <div className="space-y-0.5 w-full">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className={markdownStyles.p} {...props} />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 className={markdownStyles.h1} {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className={markdownStyles.h2} {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className={markdownStyles.h3} {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className={markdownStyles.ul} {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className={markdownStyles.ol} {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className={markdownStyles.li} {...props} />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className={markdownStyles.pre} {...props} />
                      ),
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code className={markdownStyles.code} {...props} />
                        ) : (
                          <pre className={markdownStyles.pre}>
                            <code {...props} />
                          </pre>
                        ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className={markdownStyles.blockquote}
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a className={markdownStyles.a} {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className={markdownStyles.strong} {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className={markdownStyles.em} {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <table className={markdownStyles.table} {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className={markdownStyles.th} {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className={markdownStyles.td} {...props} />
                      ),
                    }}
                  >
                    {streamingAnswer}
                  </ReactMarkdown>
                </div>
              </div>
            </fieldset>
          )}
        </div>
      </div>
      <div className="sticky w-full bottom-0">
        <Form {...form}>
          <form
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            onSubmit={form.handleSubmit(onSubmit)}
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
                      className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                      {...field}
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
              <Button
                disabled={chatState.loading}
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
              >
                {chatState.loading ? "Generating response" : "Send Message"}
                {chatState.loading ? (
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

export default ChatBlock;
