"use client";

import { Button } from "../ui/button";
import React from "react";
import { Share1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { useCopy } from "@/hooks/useCopy";

export default function ShareButton() {
  const { toast } = useToast();
  const [_, copy] = useCopy();

  function onShareClick() {
    copy("https://github.com/Avik-creator/ollama-ui")
      .then(() => {
        toast({
          title: "Link copied successfully",
          description: "https://github.com/Avik-creator/ollama-ui",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: `Failed to copy!', ${error}`,
        });
      });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-auto gap-1.5 text-sm"
      onClick={() => onShareClick()}
    >
      <Share1Icon className="size-3.5" />
      Share
    </Button>
  );
}
