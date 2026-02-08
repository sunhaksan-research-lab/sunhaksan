import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const memberSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    githubLogin: z.string().optional(),
    bio: z.string().optional(),
})

export async function GET() {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const members = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(members)
    } catch (error) {
        console.error("Failed to fetch members:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const data = memberSchema.parse(body)

        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 })
        }

        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                githubLogin: data.githubLogin,
                bio: data.bio,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 })
        }
        console.error("Failed to create member:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        // Prevent self-deletion
        if (id === session.user.id) {
            return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to delete member:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
