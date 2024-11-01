"use client";

import { ILayoutContext, ISettings } from "@/types/interface";
import React, { createContext, useContext, useState } from "react";

const LayoutContext = createContext<ILayoutContext | undefined>(undefined);

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [settings, applySettings] = useState<ISettings>({
    model: "",
    custom: false,
  });

  return (
    <LayoutContext.Provider value={{ settings, applySettings }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useSettings(): ILayoutContext {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useSettings must be used within a LayoutProvider");
  }
  return context;
}

export default LayoutProvider;
