import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { Octokit } from "@octokit/rest"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const octokit = new Octokit({ auth: session.accessToken })

        // Get project from database to get the repo full name
        const { prisma } = await import("@/lib/prisma")
        const project = await prisma.project.findUnique({
            where: { id },
        })

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        // Fetch README from GitHub
        const [owner, repo] = project.fullName.split("/")

        try {
            // Get default branch first to construct absolute URLs for relative paths
            const { data: repoData } = await octokit.rest.repos.get({
                owner,
                repo,
            })
            const defaultBranch = repoData.default_branch

            // Fetch README as HTML
            const response = await octokit.request('GET /repos/{owner}/{repo}/readme', {
                owner,
                repo,
                headers: {
                    accept: "application/vnd.github.html",
                },
            })

            let htmlContent = response.data as any

            // Transform relative image paths to absolute GitHub raw URLs
            const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}`
            const webBase = `https://github.com/${owner}/${repo}/blob/${defaultBranch}`

            // Regex for images
            htmlContent = htmlContent.replace(
                /src="(?!\/|http)([^"]+)"/g,
                (match: string, path: string) => `src="${rawBase}/${path.startsWith('./') ? path.slice(2) : path}"`
            )

            // Regex for links
            htmlContent = htmlContent.replace(
                /href="(?!\/|http|#)([^"]+)"/g,
                (match: string, path: string) => `href="${webBase}/${path.startsWith('./') ? path.slice(2) : path}"`
            )

            return NextResponse.json({
                content: htmlContent,
                owner,
                repo,
            })
        } catch (error: any) {
            if (error.status === 404) {
                return NextResponse.json(
                    { error: "README not found" },
                    { status: 404 }
                )
            }
            throw error
        }
    } catch (error) {
        console.error("Error fetching README:", error)
        return NextResponse.json(
            { error: "Failed to fetch README" },
            { status: 500 }
        )
    }
}
