import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink, Star, GitFork, Eye, Lock, Users, Calendar, Code } from "lucide-react"
import Link from "next/link"
import { ReadmeViewer } from "@/components/readme-viewer"

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = await params
    const session = await auth()

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    githubLogin: true,
                    image: true,
                },
            },
        },
    })

    if (!project) {
        notFound()
    }

    // 접근 권한 체크
    const canView =
        project.visibility === "PUBLIC" ||
        (project.visibility === "INTERNAL" && session) ||
        (project.visibility === "PRIVATE" && session?.user?.id === project.userId)

    if (!canView) {
        notFound()
    }

    const topics = project.topics ? JSON.parse(project.topics) : []
    const visibilityConfig = {
        PUBLIC: { icon: Eye, label: "공개", color: "bg-emerald-500/10 text-emerald-700" },
        INTERNAL: { icon: Users, label: "연구소", color: "bg-violet-500/10 text-violet-700" },
        PRIVATE: { icon: Lock, label: "비공개", color: "bg-slate-500/10 text-slate-700" },
    }
    const config = visibilityConfig[project.visibility as keyof typeof visibilityConfig]
    const VisibilityIcon = config.icon

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    {project.name}
                                </h1>
                                <Badge variant="outline" className={`${config.color} flex items-center gap-1.5`}>
                                    <VisibilityIcon className="w-3.5 h-3.5" />
                                    {config.label}
                                </Badge>
                            </div>

                            {project.description && (
                                <p className="text-lg text-muted-foreground mb-4">
                                    {project.description}
                                </p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <Link href={`/members/${project.user.id}`} className="flex items-center gap-2 hover:text-violet-600 transition-colors">
                                    {project.user.image && (
                                        <img src={project.user.image} alt={project.user.name || ""} className="w-6 h-6 rounded-full" />
                                    )}
                                    <span>{project.user.name || project.user.githubLogin}</span>
                                </Link>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                                </div>
                            </div>
                        </div>

                        <Link href={project.htmlUrl} target="_blank">
                            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                GitHub에서 보기
                            </Button>
                        </Link>
                    </div>

                    {/* Stats & Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 text-yellow-600">
                                    <Star className="w-5 h-5" />
                                    <span className="text-2xl font-bold">{project.stars}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">Stars</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 text-violet-600">
                                    <GitFork className="w-5 h-5" />
                                    <span className="text-2xl font-bold">{project.forks}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">Forks</p>
                            </CardContent>
                        </Card>

                        {project.language && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-cyan-600">
                                        <Code className="w-5 h-5" />
                                        <span className="text-lg font-bold">{project.language}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">언어</p>
                                </CardContent>
                            </Card>
                        )}

                        {project.featured && (
                            <Card className="bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5">
                                <CardContent className="pt-6">
                                    <div className="text-2xl">⭐</div>
                                    <p className="text-sm font-medium mt-1">주요 프로젝트</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Topics */}
                    {topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6">
                            {topics.map((topic: string) => (
                                <Badge key={topic} variant="secondary" className="px-3 py-1">
                                    {topic}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* README */}
                <Card className="mt-8">
                    <CardHeader>
                        <h2 className="text-2xl font-bold">README</h2>
                    </CardHeader>
                    <CardContent>
                        <ReadmeViewer projectId={project.id} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
