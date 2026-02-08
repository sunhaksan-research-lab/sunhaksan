"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, Plus, Check, MoreVertical, Trash2, Edit2, Shield, Eye, Lock as LockIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { redirect } from "next/navigation"

interface GitHubRepo {
    id: number
    name: string
    fullName: string
    description: string | null
    htmlUrl: string
    homepage: string | null
    language: string | null
    topics: string[]
    stars: number
    forks: number
    watchers: number
    private: boolean
    updatedAt: string
}

interface Member {
    id: string
    name: string | null
    email: string | null
    githubLogin: string | null
    bio: string | null
    createdAt: string
}

interface Project {
    id: string
    githubId: number
    name: string
    fullName: string
    description: string | null
    htmlUrl: string
    homepage: string | null
    language: string | null
    topics: string
    visibility: "PUBLIC" | "INTERNAL" | "PRIVATE"
    featured: boolean
    category: string | null
    tags: string | null
    stars: number
    forks: number
    watchers: number
    userId: string
    user: {
        name: string | null
        githubLogin: string | null
    }
    createdAt: string
    updatedAt: string
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const [repos, setRepos] = useState<GitHubRepo[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState<number | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [updating, setUpdating] = useState<string | null>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [memberLoading, setMemberLoading] = useState(false)
    const [newMember, setNewMember] = useState({ email: "", name: "", githubLogin: "" })

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/api/auth/signin")
        }

        if (status === "authenticated") {
            loadData()
            loadMembers()
        }
    }, [status])

    const loadData = async () => {
        setLoading(true)
        try {
            const [reposRes, projectsRes] = await Promise.all([
                fetch("/api/repos"),
                fetch("/api/projects"),
            ])

            if (reposRes.ok) {
                const reposData = await reposRes.json()
                setRepos(reposData)
            }

            if (projectsRes.ok) {
                const projectsData = await projectsRes.json()
                setProjects(projectsData.filter((p: Project) => p.userId === session?.user?.id))
            }
        } catch (error) {
            console.error("Failed to load data:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadMembers = async () => {
        setMemberLoading(true)
        try {
            const res = await fetch("/api/members")
            if (res.ok) {
                const data = await res.json()
                setMembers(data)
            }
        } catch (error) {
            console.error("Failed to load members:", error)
        } finally {
            setMemberLoading(false)
        }
    }

    const handleAddProject = async (repo: GitHubRepo, visibility: "PUBLIC" | "INTERNAL" | "PRIVATE") => {
        setCreating(repo.id)
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    githubId: repo.id,
                    name: repo.name,
                    fullName: repo.fullName,
                    description: repo.description,
                    htmlUrl: repo.htmlUrl,
                    homepage: repo.homepage,
                    language: repo.language,
                    topics: repo.topics,
                    stars: repo.stars,
                    forks: repo.forks,
                    watchers: repo.watchers,
                    visibility,
                }),
            })

            if (res.ok) {
                const newProject = await res.json()
                setProjects([...projects, newProject])
            } else {
                const error = await res.json()
                alert(error.error || "Failed to add project")
            }
        } catch (error) {
            console.error("Failed to add project:", error)
            alert("Failed to add project")
        } finally {
            setCreating(null)
        }
    }

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm("이 프로젝트를 연구소 아카이브에서 삭제하시겠습니까? (GitHub 레포지토리는 삭제되지 않습니다)")) {
            return
        }

        setDeleting(projectId)
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            })

            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== projectId))
            } else {
                const error = await res.json()
                alert(error.error || "삭제 실패")
            }
        } catch (error) {
            console.error("Failed to delete project:", error)
            alert("삭제 실패")
        } finally {
            setDeleting(null)
        }
    }

    const handleUpdateProject = async (projectId: string, data: any) => {
        setUpdating(projectId)
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                const updated = await res.json()
                setProjects(projects.map((p) => (p.id === projectId ? updated : p)))
            } else {
                const error = await res.json()
                alert(error.error || "수정 실패")
            }
        } catch (error) {
            console.error("Failed to update project:", error)
        } finally {
            setUpdating(null)
        }
    }

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMember.email) return

        try {
            const res = await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMember),
            })

            if (res.ok) {
                const created = await res.json()
                setMembers([created, ...members])
                setNewMember({ email: "", name: "", githubLogin: "" })
            } else {
                const error = await res.json()
                alert(error.error || "멤버 추가 실패")
            }
        } catch (error) {
            console.error("Failed to add member:", error)
        }
    }

    const handleDeleteMember = async (memberId: string) => {
        if (!confirm("이 멤버를 아카이브에서 삭제하시겠습니까?")) return

        try {
            const res = await fetch(`/api/members?id=${memberId}`, {
                method: "DELETE",
            })

            if (res.ok) {
                setMembers(members.filter((m) => m.id !== memberId))
            } else {
                const error = await res.json()
                alert(error.error || "삭제 실패")
            }
        } catch (error) {
            console.error("Failed to delete member:", error)
        }
    }

    const isProjectAdded = (githubId: number) => {
        return projects.some((p) => p.githubId === githubId)
    }

    if (status === "loading" || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-blue-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                    연구소 관리 시스템
                </h1>
                <p className="text-2xl font-bold text-muted-foreground/60 tracking-widest uppercase">
                    Lab Management System
                </p>
            </div>

            <div className="flex gap-4 mb-12 border-b pb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-4 -mb-[18px]">
                    Project Management
                </h2>
            </div>

            {/* 내 프로젝트 */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">등록된 프로젝트</h2>
                    <Button onClick={loadData} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        새로고침
                    </Button>
                </div>

                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                아직 등록된 프로젝트가 없습니다. 아래에서 GitHub 레포지토리를 선택해주세요.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="relative group">
                                <ProjectCard
                                    project={project}
                                    currentUserId={session?.user?.id}
                                />
                                <div className="absolute top-4 right-4 z-20">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/50 dark:bg-white/10 hover:bg-violet-500 hover:text-white backdrop-blur-md border border-white/20 shadow-sm rounded-full">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Visibility
                                            </div>
                                            <DropdownMenuItem onClick={() => handleUpdateProject(project.id, { visibility: "PUBLIC" })}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Public (전체 공개)
                                                {project.visibility === "PUBLIC" && <Check className="w-4 h-4 ml-auto" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateProject(project.id, { visibility: "INTERNAL" })}>
                                                <Shield className="w-4 h-4 mr-2" />
                                                Internal (멤버 한정)
                                                {project.visibility === "INTERNAL" && <Check className="w-4 h-4 ml-auto" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateProject(project.id, { visibility: "PRIVATE" })}>
                                                <LockIcon className="w-4 h-4 mr-2" />
                                                Private (비공개)
                                                {project.visibility === "PRIVATE" && <Check className="w-4 h-4 ml-auto" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => handleDeleteProject(project.id)}
                                                disabled={deleting === project.id}
                                            >
                                                {deleting === project.id ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                )}
                                                아카이브에서 제거
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                {(updating === project.id || deleting === project.id) && (
                                    <div className="absolute inset-0 z-30 bg-background/40 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* GitHub 레포지토리 */}
            <section>
                <h2 className="text-2xl font-bold mb-6">GitHub 레포지토리</h2>

                <div className="grid grid-cols-1 gap-4">
                    {repos.map((repo) => {
                        const added = isProjectAdded(repo.id)
                        const isCreating = creating === repo.id

                        return (
                            <Card key={repo.id} className={added ? "opacity-60" : ""}>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{repo.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {repo.description || "설명 없음"}
                                            </CardDescription>
                                        </div>

                                        {added ? (
                                            <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                                                <Check className="w-3 h-3" />
                                                등록됨
                                            </Badge>
                                        ) : (
                                            <div className="flex gap-2 shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAddProject(repo, "PUBLIC")}
                                                    disabled={isCreating}
                                                >
                                                    {isCreating ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Plus className="w-4 h-4 mr-1" />
                                                            공개
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAddProject(repo, "INTERNAL")}
                                                    disabled={isCreating}
                                                >
                                                    {isCreating ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Plus className="w-4 h-4 mr-1" />
                                                            연구소
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAddProject(repo, "PRIVATE")}
                                                    disabled={isCreating}
                                                >
                                                    {isCreating ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Plus className="w-4 h-4 mr-1" />
                                                            비공개
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {repo.language && (
                                        <div className="flex gap-2 mt-3">
                                            <Badge variant="secondary" className="text-xs">
                                                {repo.language}
                                            </Badge>
                                            {repo.topics.slice(0, 3).map((topic) => (
                                                <Badge key={topic} variant="outline" className="text-xs">
                                                    {topic}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* 멤버 관리 */}
            <section className="mt-20 pt-10 border-t">
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-2">Member Management</h2>
                    <p className="text-muted-foreground">연구소에 접근 가능한 인가된 멤버를 관리합니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">신규 멤버 등록</CardTitle>
                            <CardDescription>이메일과 정보를 입력하여 멤버를 추가합니다.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddMember} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email (Required)</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                        value={newMember.email}
                                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                        placeholder="홍길동"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">GitHub Login</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                        value={newMember.githubLogin}
                                        onChange={(e) => setNewMember({ ...newMember, githubLogin: e.target.value })}
                                        placeholder="github_username"
                                    />
                                </div>
                                <Button type="submit" className="w-full" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    멤버 추가
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {memberLoading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : members.length === 0 ? (
                                <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                                    등록된 멤버가 없습니다.
                                </div>
                            ) : (
                                members.map((member) => (
                                    <Card key={member.id} className="overflow-hidden">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {(member.name || member.email || "?")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {member.name || "Unknown User"}
                                                        {member.githubLogin && (
                                                            <Badge variant="outline" className="text-[10px] font-medium h-4">
                                                                @{member.githubLogin}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{member.email}</div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => handleDeleteMember(member.id)}
                                                disabled={member.id === session?.user?.id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
