import { Id } from "@/convex/_generated/dataModel";
import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export interface UserDetail {
  _id: Id<"users">;
  name: string;
  email: string;
  picture?: string;
  token: number;
}

interface UserDetailContextType {
  userDetail: UserDetail | null;
  setUserDetail: Dispatch<SetStateAction<UserDetail | null>>;
}

export const UserDetailContext =
  createContext<UserDetailContextType | null>(null);