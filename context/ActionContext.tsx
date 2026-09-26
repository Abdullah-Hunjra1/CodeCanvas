"use client";

import { createContext } from "react";

export interface Action {
  actionType: "deploy" | "export";
  timeStamp: number;
}

interface ActionContextType {
  action: Action | null;
  setAction: React.Dispatch<React.SetStateAction<Action | null>>;
}

export const ActionContext = createContext<ActionContextType | null>(null);