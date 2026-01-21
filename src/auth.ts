import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Export auth function for middleware and API routes
export async function auth() {
    const { getServerSession } = await import("next-auth");
    return getServerSession(authOptions);
}
