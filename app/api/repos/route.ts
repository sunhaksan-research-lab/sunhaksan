import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { Octokit } from "@octokit/rest"

export async function GET() {
    try {
        const session = await auth()

        if (!session || !session.accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Octokit 인스턴스 생성 (사용자의 GitHub access token 사용)
        const octokit = new Octokit({
            auth: session.accessToken,
        })

        // 사용자의 모든 레포지토리 가져오기
        const { data: repos } = await octokit.repos.listForAuthenticatedUser({
            sort: "updated",
            per_page: 100,
            affiliation: "owner",
        })

        // 필요한 정보만 추출
        const formattedRepos = repos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            htmlUrl: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            topics: repo.topics,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            private: repo.private,
            updatedAt: repo.updated_at,
        }))

        return NextResponse.json(formattedRepos)
    } catch (error) {
        console.error("GitHub API Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch repositories" },
            { status: 500 }
        )
    }
}
