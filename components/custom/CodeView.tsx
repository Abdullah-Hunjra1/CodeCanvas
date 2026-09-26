
"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { countToken } from "./ChatView";
import { UserDetailContext } from "@/context/UserDetailContext";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { ActionContext } from "@/context/ActionContext";

const CodeView = () => {
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [files, setFiles] = useState(Lookup.DEFAULT_FILE);
  const [loading, setLoading] = useState(false);

  const { messages } = useContext(MessagesContext);

  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const UpdateTokens = useMutation(api.users.UpdateToken)

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const actionContext = useContext(ActionContext);

  if (!actionContext) {
    throw new Error("CodeView must be used within Provider");
  }

  const { action } = actionContext;


  const GetFiles = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const result = await convex.query(api.workspace.GetWorkSpace, {
        workspaceId: id as Id<"workspace">,
      });

      const mergedFiles = {
        ...Lookup.DEFAULT_FILE,
        ...result?.fileData,
      };

      setFiles(mergedFiles);
    } catch (error) {
      console.error("Error loading workspace files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    GetFiles();
  }, [id]);

  useEffect(() => {
    if (!action) return;

    setActiveTab("preview");
  }, [action]);

  const GenerateAiCode = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const PROMPT =
        JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;

      const result = await axios.post("/api/gen-ai-code", {
        prompt: PROMPT,
      });

      console.log(result.data);

      const aiResp = result.data;

      const mergedFiles = {
        ...Lookup.DEFAULT_FILE,
        ...aiResp?.files,
      };

      setFiles(mergedFiles);

      await UpdateFiles({
        workspaceId: id as Id<"workspace">,
        files: aiResp?.files,
      });

      const currentTokens = userDetail?.token ?? 0;

      const token =
        currentTokens -
        countToken(JSON.stringify(aiResp));

      if (userDetail?._id) {
        await UpdateTokens({
          userId: userDetail._id,
          token,
        });

        setUserDetail((prev) =>
          prev ? { ...prev, token } : prev
        );
      }
    } catch (error) {
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!messages?.length) return;

    const role = messages[messages.length - 1].role;

    if (role === "user") {
      // React 19 set-state-in-effect lint rule
      // eslint-disable-next-line react-hooks/set-state-in-effect
      GenerateAiCode();
    }
  }, [messages]);

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-35 gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab === "code" &&
              "bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
              }`}
          >
            Code
          </h2>

          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab === "preview" &&
              "bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
              }`}
          >
            Preview
          </h2>
        </div>
      </div>

      <SandpackProvider
        files={files}
        template="react"
        theme="dark"
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: [
            "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
          ],
        }}
      >
        {activeTab === "code" ? (
          <SandpackLayout>
            <SandpackFileExplorer style={{ height: "80vh" }} />
            <SandpackCodeEditor style={{ height: "80vh" }} />
          </SandpackLayout>
        ) : (
          <SandpackPreviewClient />
        )}
      </SandpackProvider>

      {loading && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating your files...</h2>
        </div>
      )}
    </div>
  );
};

export default CodeView;