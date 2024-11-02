"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { useSettings } from "@/context/LayoutProvider";
import { IModel } from "@/types/interface";
import { Loader2, Server, Download } from "lucide-react";
import { toast } from "sonner";

export default function SettingsForm() {
  const [models, setModels] = useState<IModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [pullModelInput, setPullModelInput] = useState("");
  const [isPulling, setIsPulling] = useState(false);
  const { settings, applySettings } = useSettings();

  useEffect(() => {
    async function loadModels() {
      try {
        const response = await fetch(`api/model`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();

        setModels(data.models);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    }

    loadModels();
  }, [isPulling]);

  const handlePullModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pullModelInput) return;

    setIsPulling(true);
    try {
      const response = await fetch("api/pullModel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: pullModelInput }),
      });

      if (!response.ok) {
        throw new Error(`Failed to pull model: ${response.status}`);
      }
      // Create a new ReadableStream from the response body
      const reader = response.body.getReader();

      // Read the data in chunks
      reader.read().then(function processText({ done, value }) {
        if (done) {
          setIsPulling(false);
          return;
        }

        // Convert the chunk of data to a string
        const text = new TextDecoder().decode(value);

        // Split the text into individual JSON objects
        const jsonObjects = text.trim().split("\n");

        jsonObjects.forEach(jsonObject => {
          try {
            const responseJson = JSON.parse(jsonObject);
            if (responseJson.error) {
              toast.error("Error: " + responseJson.error);
              setIsPulling(false);
              return;
            } else if (responseJson.status === "success") {
              // Display a success toast if the response status is success
              toast.success("Model pulled successfully");
              setIsPulling(false);
              return;
            }
          } catch (error) {
            toast.error("Error parsing JSON");
            setIsPulling(false);
            return;
          }
        });

        // Continue reading the next chunk
        reader.read().then(processText);
      });
    } catch (error) {
      setIsPulling(false);
      console.error("Error pulling model:", error);
      toast.error("Error pulling model");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">AI Model Settings</CardTitle>
          <CardDescription>Configure and manage your AI models</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium">
                  Select Model
                </Label>
                <Select
                  onValueChange={model =>
                    applySettings(prev => ({
                      ...prev,
                      model: model,
                    }))
                  }
                >
                  <SelectTrigger id="model" className="w-full">
                    <SelectValue placeholder="Choose a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(item => (
                      <SelectItem value={item.model} key={item.name}>
                        <div className="flex items-center">
                          <Server className="mr-2 h-4 w-4" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.model}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Pull New Model</CardTitle>
          <CardDescription>Add a new AI model to your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePullModel} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pullModel" className="text-sm font-medium">
                Model Name
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="pullModel"
                  placeholder="Enter model name"
                  value={pullModelInput}
                  onChange={e => setPullModelInput(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" disabled={isPulling} className="w-24">
                  {isPulling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isPulling ? "Pulling" : "Pull"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
