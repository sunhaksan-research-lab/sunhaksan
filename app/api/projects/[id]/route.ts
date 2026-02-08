import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProjectSchema = z.object({
    visibility: z.enum(["PUBLIC", "INTERNAL", "PRIVATE"]).optional(),
    featured: z.boolean().optional(),
    category: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
})

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const data = updateProjectSchema.parse(body)

        // Check if project exists and user owns it
        const existing = await prisma.project.findUnique({
            where: { id },
            select: { userId: true },
        })

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        if (existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const updated = await prisma.project.update({
            where: { id },
            data: {
                visibility: data.visibility,
                featured: data.featured,
                category: data.category,
                tags: data.tags ? JSON.stringify(data.tags) : undefined,
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

        return NextResponse.json(updated)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            )
        }

        console.error("Project update error:", error)
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Check if project exists and user owns it
        const existing = await prisma.project.findUnique({
            where: { id },
            select: { userId: true },
        })

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        if (existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        await prisma.project.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Project deletion error:", error)
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        )
    }
}
