import { createAuthClient } from "better-auth/react";

export type GoogleUser = { 
    id: string; 
    name: string; 
    emailVerified: boolean; 
    email: string; 
    createdAt: Date; 
    updatedAt: Date; 
    image?: string | null | undefined; 
} | undefined;


export const authClient = createAuthClient()

export const session = authClient.useSession()
export const AuthUser : GoogleUser = session.data?.user