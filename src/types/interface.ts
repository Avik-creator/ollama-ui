import React from "react";

export interface ISettings {
  model: string;
  custom?: boolean;
}

export interface ILayoutContext {
  settings: ISettings;
  applySettings: React.Dispatch<React.SetStateAction<ISettings>>;
}

interface Message {
  role: string;
  content: string;
}

interface APIResponse {
  model: string;
  messages: Message[];
  stream: boolean;
}

export const buildResponse = (
  model: string,
  messages: Message[],
  stream: boolean,
): APIResponse => {
  return {
    model: model,
    messages: messages,
    stream: stream,
  };
};
