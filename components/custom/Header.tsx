"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { ActionContext } from "@/context/ActionContext";
import Link from "next/link";
import { LucideDownload, Rocket } from "lucide-react";
// import { useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";

const Header = () => {
  const context = useContext(UserDetailContext);
  const actionContext = useContext(ActionContext);

  if (!actionContext) {
    throw new Error("Header must be used within Provider");
  }

  const { setAction } = actionContext;

  // const { toggleSidebar } = useSidebar()
  const path = usePathname()
  console.log(path?.includes('workspace'))

  if (!context) {
    throw new Error("Header must be used within Provider");
  }

  const { userDetail } = context;

  const onActionBtn = (action: "deploy" | "export") => {
    setAction({
      actionType: action,
      timeStamp: Date.now()
    })
  }

  return (
    <div className="p-4 flex justify-between items-center border-b">
      <Link href={"/"}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
        />
      </Link>

      {!userDetail?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>

          <Button
            className="text-white"
            style={{ backgroundColor: Colors.BLUE }}
          >
            Get Started
          </Button>
        </div>
      ) : (
        path?.includes("workspace") && <div>
          <Button variant={'ghost'} onClick={() => onActionBtn('export')}><LucideDownload />Export</Button>
          <Button className='bg-blue-500 text-white hover:bg-blue-600' onClick={() => onActionBtn('deploy')}><Rocket />Deploy</Button>
          {/* {userDetail && <Image src={userDetail?.picture} alt="user" width={30} height={30}
            className=" rounded-full w-[30px]"
            onClick={toggleSidebar}
          />} */}
        </div>
      )}
    </div>
  );
};

export default Header;