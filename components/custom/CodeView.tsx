"use client";

import React, { act, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';


const CodeView = () => {
  const [activeTab, setActiveTab] = useState('code')
  const [files,setFiles] = useState(Lookup?.DEFAULT_FILE)
  return (
    <div>
      <div className=' bg-[#181818] w-full p-2 border'>
        <div className=' flex items-center flex-wrap shrink-0 bg-black p-1 w-35 gap-3 justify-center rounded-full'>
          <h2 onClick={() => setActiveTab('code')}
            className={` text-sm cursor-pointer ${activeTab == 'code' && '  bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full '}`}>Code</h2>
          <h2 onClick={() => setActiveTab('preview')}
            className={` text-sm cursor-pointer ${activeTab == 'preview' && '  bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full '}`}>Preview</h2>

        </div>
      </div>

      <SandpackProvider files={files} template="react" theme={'dark'} customSetup={{
        dependencies:{
          ...Lookup.DEPENDANCY
        }
      }}
      options={{
        externalResources:["https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"]
      }}>
        <SandpackLayout>
          {activeTab == 'code' ? <>
            <SandpackFileExplorer style={{ height: '80vh' }} />
            <SandpackCodeEditor style={{ height: '80vh' }} />
          </> :
            <>
              <SandpackPreview style={{ height: '80vh' }} showNavigator={true} />
            </>}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default CodeView