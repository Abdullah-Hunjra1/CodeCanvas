import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export interface UserDetail {
  name: string;
  email: string;
  picture?: string;
}

interface UserDetailContextType {
  userDetail: UserDetail | null;
  setUserDetail: Dispatch<SetStateAction<UserDetail | null>>;
}

export const UserDetailContext =
  createContext<UserDetailContextType | null>(null);