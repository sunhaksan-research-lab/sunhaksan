import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function MembersPage() {
    const session = await auth()

    const members = await prisma.user.findMany({
        include: {
            projects: {
                where: session
                    ? {
                        OR: [
                            { visibility: "PUBLIC" },
                            { visibility: "INTERNAL" },
                        ],
                    }
                    : { visibility: "PUBLIC" },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-blue-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                        선학산연구소
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                        Researcher Directory
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => {
                        const stats = {
                            projects: member.projects.length,
                            stars: member.projects.reduce((sum: number, p) => sum + p.stars, 0),
                        }

                        return (
                            <Link key={member.id} href={`/members/${member.id}`}>
                                <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-16 h-16">
                                                <AvatarImage src={member.image || undefined} alt={member.name || "Member"} />
                                                <AvatarFallback className="text-xl">
                                                    {member.name?.charAt(0) || member.githubLogin?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg truncate">
                                                    {member.name || member.githubLogin}
                                                </CardTitle>
                                                {member.githubLogin && (
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        @{member.githubLogin}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {member.bio && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {member.bio}
                                            </p>
                                        )}
                                        <div className="flex gap-6 text-sm">
                                            <div>
                                                <span className="font-bold text-foreground">{stats.projects}</span>
                                                <span className="text-muted-foreground ml-1 font-medium">Contributions</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-foreground">{stats.stars}</span>
                                                <span className="text-muted-foreground ml-1 font-medium">Recognition</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
