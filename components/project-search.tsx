"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"

export function ProjectSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [isPending, startTransition] = useTransition()

    const updateSearchParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== "all") {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        startTransition(() => {
            router.push(`/projects?${params.toString()}`)
        })
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    placeholder="프로젝트 검색... (이름, 설명, 기술 스택)"
                    className="pl-10 pr-12 h-12 text-base rounded-xl border-2 focus:border-violet-500"
                    defaultValue={searchParams.get("q") || ""}
                    onChange={(e) => {
                        const value = e.target.value
                        setTimeout(() => updateSearchParams("q", value), 500)
                    }}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl border">
                    <div>
                        <label className="text-sm font-medium mb-2 block">언어</label>
                        <Select
                            defaultValue={searchParams.get("language") || "all"}
                            onValueChange={(value) => updateSearchParams("language", value)}
                        >
                            <SelectTrigger className="rounded-lg">
                                <SelectValue placeholder="전체" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                <SelectItem value="TypeScript">TypeScript</SelectItem>
                                <SelectItem value="JavaScript">JavaScript</SelectItem>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="Go">Go</SelectItem>
                                <SelectItem value="Rust">Rust</SelectItem>
                                <SelectItem value="Java">Java</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">공개 범위</label>
                        <Select
                            defaultValue={searchParams.get("visibility") || "all"}
                            onValueChange={(value) => updateSearchParams("visibility", value)}
                        >
                            <SelectTrigger className="rounded-lg">
                                <SelectValue placeholder="전체" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                <SelectItem value="PUBLIC">공개</SelectItem>
                                <SelectItem value="INTERNAL">연구소</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">정렬</label>
                        <Select
                            defaultValue={searchParams.get("sort") || "recent"}
                            onValueChange={(value) => updateSearchParams("sort", value)}
                        >
                            <SelectTrigger className="rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">최신순</SelectItem>
                                <SelectItem value="stars">Stars 많은순</SelectItem>
                                <SelectItem value="forks">Forks 많은순</SelectItem>
                                <SelectItem value="name">이름순</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    )
}
