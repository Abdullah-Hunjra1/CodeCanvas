"use client";

import { ActionContext } from "@/context/ActionContext";
import {
  SandpackPreview,
  SandpackPreviewRef,
} from "@codesandbox/sandpack-react";
import React, { useContext } from "react";

interface CodeSandboxClient {
  getCodeSandboxURL: () => Promise<{
    sandboxId?: string;
    editorUrl?: string;
  }>;
}

const SandpackPreviewClient = () => {
  const actionContext = useContext(ActionContext);

  if (!actionContext) {
    throw new Error("SandpackPreviewClient must be used within Provider");
  }

  const { action } = actionContext;

  const previewRef = React.useRef<SandpackPreviewRef | null>(null);

  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient();

    if (!client) return;

    const codeSandboxClient = client as typeof client & CodeSandboxClient;

    if (typeof codeSandboxClient.getCodeSandboxURL !== "function") {
      console.error("getCodeSandboxURL is not available on Sandpack client");
      return;
    }

    const result = await codeSandboxClient.getCodeSandboxURL();

    if (action?.actionType === "deploy" && result.sandboxId) {
      window.open(
        `https://${result.sandboxId}.csb.app/`,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (action?.actionType === "export" && result.editorUrl) {
      window.open(
        result.editorUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  React.useEffect(() => {
    if (!action) return;

    GetSandpackClient();
  }, [action]);

  return (
    <div className="w-full">
      <SandpackPreview
        style={{ height: "80vh", width: "100%" }}
        showNavigator={true}
        ref={previewRef}
      />
    </div>
  );
};

export default SandpackPreviewClient;