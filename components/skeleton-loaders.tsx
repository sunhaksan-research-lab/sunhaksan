import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProjectSkeleton() {
    return (
        <Card className="h-full relative overflow-hidden flex flex-col border-border/50">
            <CardHeader className="space-y-2 pb-4">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-7 w-3/4" />
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <Skeleton className="h-16 w-full" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-14" />
                </div>
            </CardContent>
            <CardFooter className="pt-4 pb-4 border-t bg-muted/20">
                <Skeleton className="h-4 w-32" />
            </CardFooter>
        </Card>
    )
}

export function MemberSkeleton() {
    return (
        <div className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
        </div>
    )
}

export function ProjectGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <ProjectSkeleton key={i} />
            ))}
        </div>
    )
}
