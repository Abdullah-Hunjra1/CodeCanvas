"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { Message, MessagesContext } from "@/context/MessagesContext";
import { UserDetail, UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/AppSidebar";
import { type Action, ActionContext } from "@/context/ActionContext";
import { useRouter } from "next/navigation";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [userDetail, setUserDetail] = React.useState<UserDetail | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const convex = useConvex()
  const router = useRouter()


  const IsAuthenticated = async () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser) as {
        email?: string;
      };
      if (!user.email) {
        router.push("/")
        return
      }
      //Fetch from Database
      const result = await convex.query(api.users.GetUser, {
        email: user.email
      })
      setUserDetail(result ?? null);
      console.log(result)

    }
  }

  useEffect(() => {
    IsAuthenticated();
  }, [convex, router])
  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY!}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <SidebarProvider defaultOpen={false}>
                  <Header />
                  <AppSidebar />
                  {children}
                </SidebarProvider>
              </NextThemesProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Provider;