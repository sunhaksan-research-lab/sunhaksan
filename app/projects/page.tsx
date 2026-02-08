import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProjectCard } from "@/components/project-card"
import { ProjectSearch } from "@/components/project-search"
import { Rocket } from "lucide-react"

interface ProjectsPageProps {
    searchParams: {
        q?: string
        language?: string
        visibility?: string
        sort?: string
    }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
    const session = await auth()
    const { q, language, visibility, sort } = searchParams

    // Build where clause
    const where: any = {}

    // Visibility filter
    if (session) {
        if (visibility && visibility !== "all") {
            where.visibility = visibility
        } else {
            where.OR = [
                { visibility: "PUBLIC" },
                { visibility: "INTERNAL" },
            ]
        }
    } else {
        where.visibility = "PUBLIC"
    }

    // Language filter
    if (language && language !== "all") {
        where.language = language
    }

    // Search query
    if (q) {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { language: { contains: q, mode: "insensitive" } },
        ]
    }

    // Build orderBy
    let orderBy: any = { updatedAt: "desc" } // default
    if (sort === "stars") {
        orderBy = { stars: "desc" }
    } else if (sort === "forks") {
        orderBy = { forks: "desc" }
    } else if (sort === "name") {
        orderBy = { name: "asc" }
    }

    const projects = await prisma.project.findMany({
        where,
        include: {
            user: {
                select: {
                    name: true,
                    githubLogin: true,
                },
            },
        },
        orderBy,
    })

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-blue-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                        선학산연구소
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                        Archive & Collaboration
                    </p>
                </div>
                <div className="mb-8">
                    <ProjectSearch />
                </div>

                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                currentUserId={session?.user?.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-border/50">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            <Rocket className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg text-muted-foreground mb-4">
                            {q ? `"${q}"에 대한 검색 결과가 없습니다.` : "등록된 프로젝트가 없습니다."}
                        </p>
                        {!q && (
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                대시보드에서 전문적인 프로젝트를 아카이빙하여 연구소의 자산으로 정립하십시오.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
