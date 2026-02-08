import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Sparkles, Code2, Rocket, Users, Lock } from "lucide-react"
import Link from "next/link"
import { signIn } from "@/lib/auth"

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 animate-gradient-xy" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-20 h-20 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-xl animate-pulse delay-1000" />

            <div className="container mx-auto max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-slate-100/5 border border-slate-900/10 dark:border-slate-100/10 mb-8 backdrop-blur-md">
                        <Lock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold tracking-tight text-foreground/80 lowercase">
                            authorized personnel only
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                        선학산연구소
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        Sunhaksan Research Lab
                    </p>
                </div>

                <Card className="border-border/50 shadow-2xl bg-background/95">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl font-bold">로그인</CardTitle>
                        <CardDescription>
                            GitHub 인증을 통해 내부 시스템으로 접근하십시오.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* GitHub Login Button */}
                        <form
                            action={async () => {
                                "use server"
                                await signIn("github")
                            }}
                        >
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full text-base py-7 bg-foreground text-background hover:bg-foreground/90 font-bold"
                            >
                                <Github className="w-5 h-5 mr-3" />
                                Login with GitHub
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="bg-background px-3 text-muted-foreground">
                                    Internal Service Features
                                </span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                    <Code2 className="w-4 h-4 text-foreground" />
                                </div>
                                <span className="text-muted-foreground font-medium">GitHub 프로젝트 라이브러리 연동</span>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                    <Rocket className="w-4 h-4 text-foreground" />
                                </div>
                                <span className="text-muted-foreground font-medium">내부 연구원 프로필 및 아카이브 관리</span>
                            </div>
                        </div>

                        {/* Back to Home */}
                        <div className="pt-4 text-center">
                            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                                [ BACK TO HOME ]
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy Note */}
                <p className="text-[10px] text-center text-muted-foreground mt-8 uppercase tracking-tighter">
                    This system is restricted to authorized members only.<br />
                    Unauthorized access is strictly prohibited.
                </p>
            </div>
        </div>
    )
}
