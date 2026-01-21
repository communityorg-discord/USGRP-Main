import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Set NEXTAUTH_URL for production
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://citizen.usgrp.xyz";

const handler = NextAuth({
    secret: "x7K9mP4vQw2sL8nR3tY6uJ1fH5gC0bWa",
    providers: [
        DiscordProvider({
            clientId: "1459400314372489246",
            clientSecret: "cVot7bjutcnVS9SAc-nI8ISD3T59LM-t",
            authorization: {
                params: {
                    scope: "identify guilds"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.id = (profile as { id?: string }).id;
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };

