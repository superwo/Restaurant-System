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
})