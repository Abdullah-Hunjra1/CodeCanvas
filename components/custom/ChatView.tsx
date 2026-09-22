"use client";

import Image from "next/image";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Lookup from "@/data/Lookup";
import { Id } from "@/convex/_generated/dataModel";
import Prompt from "@/data/Prompt";
import axios from "axios";
import ReactMarkDown from 'react-markdown'
import { useSidebar } from "../ui/sidebar";


const ChatView = () => {
    const { id } = useParams<{ id: string }>();
    const convex = useConvex();

    const userContext = useContext(UserDetailContext);

    if (!userContext) {
        throw new Error("ChatView must be used within Provider");
    }

    const { userDetail } = userContext;

    const messagesContext = useContext(MessagesContext);

    if (!messagesContext) {
        throw new Error("ChatView must be used within Provider");
    }

    const { messages, setMessages } = messagesContext;

    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState(false)
    const UpdateMessages = useMutation(api.workspace.UpdateMessages)
    const {toggleSidebar}=useSidebar()



    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkSpace, {
            workspaceId: id as Id<"workspace">,
        });

        setMessages(result?.messages ?? []);
    };

    const onGenerate = (input: string) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }])
        setUserInput('')
    };

    useEffect(() => {
        if (id) {
            GetWorkspaceData();
        }
    }, [id]);

    const GetAiResponse = async () => {
        setLoading(true)
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT
        const result = await axios.post("/api/ai-chat", {
            prompt: PROMPT
        })

        const aiResp = {
            role: 'assistant' as const,
            content: result.data.result
        }
        setMessages(prev => [...prev, aiResp])

        await UpdateMessages({
            messages: [...messages, aiResp],
            workspaceId: id as Id<"workspace">
        })
        setLoading(false)
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role == 'user') {
                GetAiResponse()
            }
        }
    }, [messages]);


    return (
        <div className="relative h-[85vh] flex flex-col">
            <div className="flex-1 overflow-y-scroll scrollbar-hide pl-5">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7"
                        style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
                    >
                        {msg.role === "user" && userDetail?.picture && (
                            <Image
                                src={userDetail.picture}
                                alt="userImage"
                                width={35}
                                height={35}
                                className="rounded-full"
                            />
                        )}

                        <div className="flex flex-col">
                            <ReactMarkDown>{msg.content}</ReactMarkDown>
                        </div>

                    </div>
                ))}
                {loading && <div className="p-3 rounded-lg mb-2 flex gap-2 items-start" style={{ backgroundColor: Colors.CHAT_BACKGROUND }}>
                    <Loader2Icon className=" animate-spin" />
                    <h2>Generating Response...</h2>
                </div>}
            </div>

            {/* Input Section */}
            <div className=" flex gap-2 items-end">
                {userDetail && <Image className=" rounded-full cursor-pointer" onClick={toggleSidebar} src={userDetail?.picture} alt="user" width={30} height={30} />}
                <div
                    className="p-5 border rounded-xl max-w-xl w-full mt-3"
                    style={{ backgroundColor: Colors.BACKGROUND }}
                >
                    <div className="flex gap-2">
                        <textarea
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            value={userInput}
                            onChange={(event) => setUserInput(event.target.value)}
                            className="outline-none border-transparent w-full h-32 max-h-56 resize-none"
                        />

                        {userInput && (
                            <ArrowRight
                                onClick={() => onGenerate(userInput)}
                                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
                            />
                        )}
                    </div>

                    <div>
                        <Link className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatView;