import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProjectCard } from "@/components/project-card"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Github, Mail } from "lucide-react"
import Link from "next/link"

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()

    const member = await prisma.user.findUnique({
        where: { id },
        include: {
            projects: {
                where: session
                    ? {
                        OR: [
                            { visibility: "PUBLIC" },
                            { visibility: "INTERNAL" },
                            { userId: id },
                        ],
                    }
                    : { visibility: "PUBLIC" },
                include: {
                    user: {
                        select: {
                            name: true,
                            githubLogin: true,
                        },
                    },
                },
                orderBy: [
                    { featured: "desc" },
                    { updatedAt: "desc" },
                ],
            },
        },
    })

    if (!member) {
        notFound()
    }

    const stats = {
        totalProjects: member.projects.length,
        totalStars: member.projects.reduce((sum: number, p) => sum + p.stars, 0),
        totalForks: member.projects.reduce((sum: number, p) => sum + p.forks, 0),
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Member Profile */}
                <div className="mb-12 flex flex-col md:flex-row gap-8 items-start">
                    <Avatar className="w-32 h-32 border-4 border-border">
                        <AvatarImage src={member.image || undefined} alt={member.name || "Member"} />
                        <AvatarFallback className="text-4xl">
                            {member.name?.charAt(0) || member.githubLogin?.charAt(0) || "?"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">
                            {member.name || member.githubLogin}
                        </h1>

                        {member.bio && (
                            <p className="text-lg text-muted-foreground mb-4">{member.bio}</p>
                        )}

                        <div className="flex gap-4 mb-6">
                            {member.email && (
                                <Link
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    {member.email}
                                </Link>
                            )}
                            {member.githubLogin && (
                                <Link
                                    href={`https://github.com/${member.githubLogin}`}
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                    @{member.githubLogin}
                                </Link>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6">
                            <div>
                                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                                <div className="text-sm text-muted-foreground">프로젝트</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.totalStars}</div>
                                <div className="text-sm text-muted-foreground">Stars</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.totalForks}</div>
                                <div className="text-sm text-muted-foreground">Forks</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">연구 프로젝트</h2>

                    {member.projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {member.projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    currentUserId={session?.user?.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">
                                아직 등록된 프로젝트가 없습니다
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
