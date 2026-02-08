import { Project } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, GitFork, Eye, Lock, Users } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
    project: any
    currentUserId?: string
}

const visibilityConfig = {
    PUBLIC: {
        icon: Eye,
        label: "Public",
        color: "bg-emerald-500/5 text-emerald-600 border-emerald-500/20",
        gradient: "from-emerald-500/10 to-transparent",
    },
    INTERNAL: {
        icon: Users,
        label: "Internal",
        color: "bg-violet-500/5 text-violet-600 border-violet-500/20",
        gradient: "from-violet-500/10 to-transparent",
    },
    PRIVATE: {
        icon: Lock,
        label: "Confidential",
        color: "bg-slate-500/5 text-slate-600 border-slate-500/20",
        gradient: "from-slate-500/10 to-transparent",
    },
}

export function ProjectCard({ project, currentUserId }: ProjectCardProps) {
    const config = visibilityConfig[project.visibility as keyof typeof visibilityConfig]
    const VisibilityIcon = config.icon

    // 접근 권한 체크
    const canView =
        project.visibility === "PUBLIC" ||
        (project.visibility === "INTERNAL" && currentUserId) ||
        (project.visibility === "PRIVATE" && currentUserId === project.userId)

    if (!canView) {
        return null
    }

    const topics = project.topics ? JSON.parse(project.topics) : []
    const showDetails = project.visibility !== "PRIVATE" || currentUserId === project.userId

    return (
        <Link href={`/projects/${project.id}`} className="block">
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-violet-500/50 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm cursor-pointer">
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl font-bold mb-2 group-hover:text-violet-600 transition-colors duration-300">
                                <div className="flex items-center gap-2 group/link">
                                    <span className="truncate">{project.name}</span>
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                                </div>
                            </CardTitle>
                            <CardDescription className="text-sm flex items-center gap-2">
                                <span className="truncate">by {project.user?.name || project.user?.githubLogin || "Unknown Member"}</span>
                            </CardDescription>
                        </div>

                        <Badge variant="outline" className={`${config.color} flex items-center gap-1.5 shrink-0 px-3 py-1 backdrop-blur-sm`}>
                            <VisibilityIcon className="w-3.5 h-3.5" />
                            <span className="font-medium">{config.label}</span>
                        </Badge>
                    </div>

                    {project.description && (
                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>
                    )}
                </CardHeader>

                <CardContent className="relative z-10">
                    {/* 기술 스택 & 토픽 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.language && (
                            <Badge variant="secondary" className="font-mono text-xs px-2.5 py-1 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-violet-500/20">
                                {project.language}
                            </Badge>
                        )}
                        {topics.slice(0, 3).map((topic: string) => (
                            <Badge key={topic} variant="outline" className="text-xs px-2.5 py-1 hover:bg-violet-500/10 transition-colors">
                                {topic}
                            </Badge>
                        ))}
                        {topics.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2.5 py-1">
                                +{topics.length - 3}
                            </Badge>
                        )}
                    </div>

                    {/* 통계 */}
                    {showDetails && (
                        <div className="flex items-center gap-5 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 group/stat">
                                <Star className="w-4 h-4 group-hover/stat:text-yellow-500 transition-colors" />
                                <span className="font-medium">{project.stars}</span>
                            </div>
                            <div className="flex items-center gap-1.5 group/stat">
                                <GitFork className="w-4 h-4 group-hover/stat:text-violet-500 transition-colors" />
                                <span className="font-medium">{project.forks}</span>
                            </div>
                        </div>
                    )}
                </CardContent>

                {project.featured && (
                    <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 py-3 relative z-10">
                        <Badge className="text-[10px] font-bold tracking-widest uppercase bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-0">
                            Technical Milestone
                        </Badge>
                    </CardFooter>
                )}
            </Card>
        </Link>
    )
}
