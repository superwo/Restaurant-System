import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import crypto from "crypto";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'mongodb',
    }),
    // so that we ca have a uniform id across all models(prisma schema)
    advanced: {
        database: {
            generateId: () => {
                return crypto.randomBytes(16).toString("hex");
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true, // Automatically sign in users after they sign up
    },
    account: {
        accountLinking: {
            enabled: true,
        },
    },
    baseURL: "http://localhost:5000",
    trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
})