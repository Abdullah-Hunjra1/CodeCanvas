import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup';
import { Button } from '../ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useMutation } from 'convex/react';
// import { CreateUser } from '../../convex/users';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';

interface GoogleUser {
    name: string;
    email: string;
    picture: string;
}

interface SignInDialogProps {
    openDialog: boolean;
    closeDialog: () => void;
}

const SignInDialog = ({
    openDialog,
    closeDialog,
}: SignInDialogProps) => {
    const context = useContext(UserDetailContext);

    if (!context) {
        throw new Error("SignInDialog must be used within Provider");
    }

    const { setUserDetail } = context;

    const createUser = useMutation(api.users.CreateUser);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const userInfo = await axios.get<GoogleUser>(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                }
            );

            const user = userInfo.data;

            await createUser({
                name: user.name,
                email: user.email,
                picture: user.picture,
                uid: uuidv4(),
            });

            localStorage.setItem("user", JSON.stringify(user));

            setUserDetail(user);
            closeDialog();
        },

        onError: (errorResponse) => {
            console.log(errorResponse);
        },
    });

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={closeDialog} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription >
                            <div className='flex flex-col items-center justify-center gap-3'>
                                <h2 className='font-bold text-2xl text-center text-white'>{Lookup.SIGNIN_HEADING}</h2>
                                <p className='mt-2 text-center'>{Lookup.SIGNIN_SUBHEADING}</p>
                                <Button onClick={() => googleLogin()} className=' bg-blue-500 text-white hover:bg-blue-400 mt-3'>Sign In With Google</Button>
                                <p>{Lookup?.SIGNIn_AGREEMENT_TEXT}</p>

                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SignInDialog


