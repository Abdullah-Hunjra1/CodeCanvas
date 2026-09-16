"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { Message, MessagesContext } from "@/context/MessagesContext";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  const [messages, setMessages] = React.useState<Message>([]);
  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        {children}
      </NextThemesProvider>
    </MessagesContext.Provider>
  );
};

export default Provider;