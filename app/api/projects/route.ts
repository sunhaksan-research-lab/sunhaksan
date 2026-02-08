import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createProjectSchema = z.object({
    githubId: z.number(),
    name: z.string(),
    fullName: z.string(),
    description: z.string().nullable(),
    htmlUrl: z.string(),
    homepage: z.string().nullable(),
    language: z.string().nullable(),
    topics: z.array(z.string()),
    stars: z.number(),
    forks: z.number(),
    watchers: z.number(),
    visibility: z.enum(["PUBLIC", "INTERNAL", "PRIVATE"]).default("INTERNAL"),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const data = createProjectSchema.parse(body)

        // 이미 등록된 프로젝트인지 확인
        const existing = await prisma.project.findUnique({
            where: { githubId: data.githubId },
        })

        if (existing) {
            return NextResponse.json(
                { error: "Project already exists" },
                { status: 409 }
            )
        }

        // 프로젝트 생성
        const project = await prisma.project.create({
            data: {
                githubId: data.githubId,
                name: data.name,
                fullName: data.fullName,
                description: data.description,
                htmlUrl: data.htmlUrl,
                homepage: data.homepage,
                language: data.language,
                topics: JSON.stringify(data.topics),
                stars: data.stars,
                forks: data.forks,
                watchers: data.watchers,
                visibility: data.visibility,
                category: data.category,
                tags: data.tags ? JSON.stringify(data.tags) : null,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        githubLogin: true,
                    },
                },
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            )
        }

        console.error("Project creation error:", error)
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        )
    }
}

// 프로젝트 목록 조회
export async function GET() {
    try {
        const session = await auth()

        const projects = await prisma.project.findMany({
            where: session?.user
                ? {
                    OR: [
                        { visibility: "PUBLIC" },
                        { visibility: "INTERNAL" },
                        { userId: session.user.id },
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
        })

        return NextResponse.json(projects)
    } catch (error) {
        console.error("Projects fetch error:", error)
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        )
    }
}
