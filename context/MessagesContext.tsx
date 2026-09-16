import { createContext } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MessagesContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);