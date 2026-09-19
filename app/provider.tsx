"use client";

import React, { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { Message, MessagesContext } from "@/context/MessagesContext";
import { UserDetail, UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [userDetail, setUserDetail] = React.useState<UserDetail | null>(null);
  const convex = useConvex()


  const IsAuthenticated = async () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      //Fetch from Database
      const result = await convex.query(api.users.GetUser, {
        email: user?.email
      })
      setUserDetail(result)
      console.log(result)

    }
  }

  useEffect(() => {
    IsAuthenticated();
  }, [])
  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY!}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
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
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Provider;