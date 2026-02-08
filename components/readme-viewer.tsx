"use client"

import { useEffect, useState } from "react"
import { Loader2, FileText } from "lucide-react"

interface ReadmeViewerProps {
    projectId: string
}

export function ReadmeViewer({ projectId }: ReadmeViewerProps) {
    const [content, setContent] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchReadme() {
            try {
                const response = await fetch(`/api/projects/${projectId}/readme`)

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("README 파일을 찾을 수 없어요 😢")
                    } else {
                        setError("README를 불러오는데 실패했어요")
                    }
                    return
                }

                const data = await response.json()
                setContent(data.content)
            } catch (err) {
                setError("README를 불러오는데 실패했어요")
            } finally {
                setLoading(false)
            }
        }

        fetchReadme()
    }, [projectId])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{error}</p>
            </div>
        )
    }

    return (
        <div
            className="prose prose-slate dark:prose-invert max-w-none 
                /* Hide GitHub's default anchor icons */
                [&_.anchor]:hidden
                /* Typography & Spacing */
                prose-headings:text-foreground prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-6 prose-h1:border-b prose-h1:pb-2
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-1
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:leading-7 prose-p:my-4
                /* High-contrast Links */
                prose-a:text-blue-600 dark:prose-a:text-blue-400 
                prose-a:font-semibold prose-a:underline prose-a:underline-offset-4
                hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300
                /* Media & Code */
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10 prose-img:mx-auto
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800 prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-6
                prose-blockquote:border-l-4 prose-blockquote:border-violet-500 prose-blockquote:bg-violet-500/5 prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: content || "" }}
        />
    )
}
