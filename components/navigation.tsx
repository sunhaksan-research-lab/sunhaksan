import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, LayoutDashboard, Mountain } from "lucide-react"

export async function Navigation() {
    const session = await auth()

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2 rounded-lg bg-foreground text-background group-hover:scale-110 transition-transform duration-300">
                                <Mountain className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                                선학산연구소
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/projects" className="text-sm font-bold tracking-tight text-muted-foreground hover:text-foreground transition-colors uppercase">
                                Internal Archive
                            </Link>
                            <Link href="/members" className="text-sm font-bold tracking-tight text-muted-foreground hover:text-foreground transition-colors uppercase">
                                Researchers
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-foreground">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        관리자 대시보드
                                    </Button>
                                </Link>
                                <form action="/api/auth/signout" method="POST">
                                    <Button variant="outline" size="sm" type="submit" className="border-border hover:bg-accent text-xs font-bold uppercase tracking-widest px-4">
                                        <LogOut className="w-3 h-3 mr-2" />
                                        Log Out
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <Link href="/api/auth/signin">
                                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-bold px-6">
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
