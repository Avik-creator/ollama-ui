import React from "react";

export interface ISettings {
  model: string;
  custom?: boolean;
}

export interface ILayoutContext {
  settings: ISettings;
  applySettings: React.Dispatch<React.SetStateAction<ISettings>>;
}
