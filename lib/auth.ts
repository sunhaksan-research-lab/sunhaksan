import NextAuth, { DefaultSession } from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            githubId?: string
            githubLogin?: string
        } & DefaultSession["user"]
        accessToken?: string
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            authorization: {
                params: {
                    scope: "read:user user:email repo",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.githubId = (user as any).githubId
                token.githubLogin = (user as any).githubLogin
            }
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            // 세션에 추가 정보 포함
            if (session.user && token) {
                session.user.id = token.id as string
                session.user.githubId = token.githubId as string
                session.user.githubLogin = token.githubLogin as string
            }
            // accessToken을 세션에 포함 (Octokit에서 사용)
            session.accessToken = token.accessToken as string
            return session
        },
        async signIn({ user, account, profile }) {
            // GitHub 정보를 User 모델에 저장 (필요한 경우에만)
            if (account?.provider === "github" && profile && user.id) {
                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            githubId: String(profile.id),
                            githubLogin: (profile as any).login,
                            bio: (profile as any).bio,
                        },
                    })
                } catch (error) {
                    console.error("Failed to update user GitHub profile:", error)
                }
            }
            return true
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
})
