import { ActionContext } from '@/context/ActionContext';
import { SandpackPreview, SandpackPreviewRef, useSandpack } from '@codesandbox/sandpack-react'
import React, { useContext } from 'react'

const SandpackPreviewClient = () => {
    const { sandpack } = useSandpack();
    const actionContext = useContext(ActionContext);

    if (!actionContext) {
        throw new Error("SandpackPreviewClient must be used within Provider");
    }

    const { action } = actionContext;
    const previewRef = React.useRef<SandpackPreviewRef | null>(null);

    const GetSandpackClient = async () => {
        const client = previewRef.current?.getClient();
        if (client) {
            console.log(client)
            const result = await client.getCodeSandboxURL()
            if (action?.actionType === 'deploy') {
                window.open(
                    `https://${result?.sandboxId}.csb.app/`,
                    "_blank",
                    "noopener,noreferrer"
                );
            } else if (action?.actionType === 'export') {
                window.open(
                    result?.editorUrl,
                    "_blank",
                    "noopener,noreferrer"
                );
            }
        }
    }

    React.useEffect(() => {
        GetSandpackClient()

    }, [action]);

    return (
        <div>
            <SandpackPreview
                style={{ height: "80vh" }}
                showNavigator={true}
                ref={previewRef}
            />
        </div>
    )
}

export default SandpackPreviewClient