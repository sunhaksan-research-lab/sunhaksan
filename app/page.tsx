import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Sparkles, Rocket } from "lucide-react"
import Link from "next/link"
import { projects } from "@/data/content"

export default function HomePage() {
  const featuredProjects = projects.filter(p => p.featured)
  const recentProjects = projects.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 animate-gradient-xy" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-slate-100/5 border border-slate-900/10 dark:border-slate-100/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold tracking-tight text-foreground/80">
              Professional Research Network
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
            <span className="bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-x px-2">
              선학산연구소
            </span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-foreground/60 mt-4 block tracking-[0.2em] uppercase">
              Sunhaksan Research Lab
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            내 외부 프로젝트의 체계적인 아카이빙과 공유를 지원합니다.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="https://github.com/sunhaksan-research-lab" target="_blank">
              <Button size="lg" className="text-base px-10 py-7 rounded-lg font-bold bg-foreground text-background hover:bg-foreground/90 transition-all">
                <Github className="w-5 h-5 mr-3" />
                GitHub Organization
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-3 gap-12 max-w-3xl mx-auto py-12 border-y border-border/50">
            <div className="text-center">
              <div className="text-4xl font-bold tracking-tighter text-foreground">
                {projects.length}+
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-bold">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold tracking-tighter text-foreground">
                7+
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-bold">Researchers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold tracking-tighter text-foreground">
                12+
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-bold">Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-24 px-4 relative">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                  <span className="text-xs font-medium text-violet-600">Featured</span>
                </div>
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  주목할 만한 프로젝트 ⭐
                </h2>
                <p className="text-muted-foreground text-lg">
                  지금 핫한 프로젝트들을 확인해보세요
                </p>
              </div>
              <Link href="/projects">
                <Button variant="ghost" className="hover:bg-violet-500/10">
                  전체 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Projects */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <Rocket className="w-3 h-3 text-cyan-500" />
                <span className="text-xs font-medium text-cyan-600">Latest</span>
              </div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
                방금 올라온 프로젝트 🔥
              </h2>
              <p className="text-muted-foreground text-lg">
                실시간으로 업데이트되는 프로젝트들
              </p>
            </div>
            <Link href="/projects">
              <Button variant="ghost" className="hover:bg-cyan-500/10">
                전체 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl border border-violet-500/10 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-violet-600" />
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                아직 등록된 프로젝트가 없습니다
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
