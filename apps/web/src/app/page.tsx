import { Button } from '@/components/ui/button.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModeToggle } from '@/components/ui/theme-toggle.tsx'
import { MeshGradient } from '@paper-design/shaders-react'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Globe,
  Search,
  Shield,
  Users,
  Zap,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

// Company Logos (SVGs)
const CompanyLogos = () => (
  <div className="flex gap-12 items-center animate-marquee min-w-full justify-around px-4">
    {/* Spotify-ish */}
    <svg
      className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
      viewBox="0 0 24 24"
      fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.18.3-.56.41-.86.23-2.35-1.44-5.3-1.76-8.79-.96-.34.08-.68-.14-.76-.48-.08-.34.14-.68.48-.76 3.84-.88 7.12-.52 9.69.89.3.18.41.56.23.86zm1.23-2.73c-.23.37-.71.49-1.08.26-2.69-1.65-6.8-2.13-9.96-1.16-.42.13-.87-.11-.99-.53-.13-.42.11-.87.53-.99 3.6-1.1 8.24-.54 11.24 1.34.37.23.49.71.26 1.08zm.11-2.77c-3.23-1.92-8.56-2.1-11.64-1.16-.49.15-1.01-.13-1.16-.62-.15-.49.13-1.01.62-1.16 3.56-1.08 9.4-.87 13.06 1.3.45.27.6.85.33 1.3-.27.45-.85.6-1.21.34z" />
    </svg>

    {/* Microsoft-ish */}
    <svg
      className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
      viewBox="0 0 24 24"
      fill="currentColor">
      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
    </svg>

    {/* Apple-ish */}
    <svg
      className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
      viewBox="0 0 24 24"
      fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.98 1.07-3.12-1.05.05-2.31.72-3.06 1.64-.69.85-1.28 2.21-1.11 3.23 1.19.09 2.38-.91 3.1-1.75z" />
    </svg>

    {/* Airbnb-ish */}
    <svg
      className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
      viewBox="0 0 24 24"
      fill="currentColor">
      <path d="M12.01 2.02c-5.52 0-10 4.49-10 10.02 0 5.51 4.48 10 10 10 5.51 0 9.99-4.49 9.99-10 0-5.53-4.48-10.02-9.99-10.02zm0 17.52c-2.3 0-4.16-1.85-4.16-4.16 0-2.29 1.86-4.15 4.16-4.15 2.29 0 4.15 1.86 4.15 4.15 0 2.31-1.86 4.16-4.15 4.16zm-5.84-4.16c0-3.22 2.62-5.84 5.84-5.84 3.21 0 5.83 2.62 5.83 5.84 0 3.21-2.62 5.83-5.83 5.83-3.23 0-5.84-2.62-5.84-5.83zm13.34-5.67c0 2.5-1.51 4.63-3.66 5.48.55-.91.88-1.99.88-3.16 0-3.3-2.67-5.99-5.96-5.99-3.29 0-5.97 2.67-5.97 5.99 0 1.16.32 2.23.87 3.14-2.13-.85-3.64-2.98-3.64-5.46 0-3.24 2.63-5.87 5.87-5.87 3.23 0 5.86 2.63 5.86 5.87 0 0 5.75-.41 5.75-.41z" />
    </svg>

    {/* Amazon-ish */}
    <svg
      className="h-16 w-auto opacity-60 hover:opacity-100 transition-opacity"
      viewBox="0 0 24 24"
      fill="currentColor">
      <path d="M13.43 12.02c.07-.46.12-.91.13-1.36.03-.78-.1-1.51-.57-1.78-.34-.19-.89-.12-1.25.12-.34.22-.55.63-.58 1.09-.04.47.1 1.09.43 1.48.33.38.79.62 1.34.62.18-.01.35-.06.5-.17zm-1.63 3.62c-.77.34-2.14.39-3.08-.1-1.68-.87-2.03-3.32-2.03-3.32s-1.07 1.32-1.07 3.08c0 1.5.87 2.6 2.32 2.94 1.45.34 2.87-.12 3.86-.6v-2zm5.72-2.7c-.55-1.32-2.06-2.58-4.2-2.88-2.14-.3-4.22.42-5.44 1.76-1.22 1.34-1.33 3.26-.37 5.06-1.47 1.39-4.2 1.94-6.44 1.25-2.24-.69-3.14-2.51-2.97-4.1.17-1.59 1.47-4.24 5.39-5.32 3.92-1.08 7.64 1.11 9.38 3.19 1.74 2.08 2.03 2.07 2.03 2.07s-.18-.32-.23-.61c-.05-.29-.25-.62-.57-1.12.32-.49.95.14 1.25 1.1.3 1.03.17 1.8.17 1.8l-1.92.5c0 .03.35 1.29 2 1.39 1.65.1 2.37-1.39 2.37-1.39s.2-.95.83-.87c.63.08 1.15.54.91 1.07-.24.53-1.15 2.1-3.69 2.2-2.54.1-3.41-1.31-3.41-1.31s-.7 1.7-2.61 2.31c-1.91.61-3.46-.35-3.46-.35s.88-.06 1.4-.41c.52-.35 1.26-1.28 1.26-1.28v-2.19c.47.07.95.03 1.41-.12.46-.15.85-.45 1.15-.84z" />
    </svg>
  </div>
)

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen max-h-dvh bg-background font-sans selection:bg-primary/20 overflow-y-auto">
      <header className="sticky top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <nav className="flex max-w-7xl mx-auto justify-between items-center p-4">
          <NavLink
            to={'/'}
            aria-label={'Logo'}
            className="text-2xl font-bold tracking-tighter flex items-center gap-1">
            <span className="text-primary italic">Job</span>
            <span>Portal</span>
          </NavLink>

          <div className="hidden lg:flex items-center bg-secondary/50 rounded-full px-6 py-1.5 border">
            <ul className="flex text-sm font-medium gap-8">
              <li>
                <NavLink
                  to={'/'}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground transition-colors'
                  }>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/app/jobs'}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground transition-colors'
                  }>
                  Find Jobs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/app/employer'}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground transition-colors'
                  }>
                  For Employers
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" asChild>
                <NavLink to="/login">Log in</NavLink>
              </Button>
              <Button asChild>
                <NavLink to="/register">Sign up</NavLink>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative h-[800px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
            {/* Using a nice blue/purple mesh gradient */}
            <MeshGradient
              width={1920}
              height={1080}
              colors={['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']} // Blue, Purple, Pink, Cyan
              distortion={1}
              speed={0.5}
              grainOverlay={0.8}
            />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background/50 backdrop-blur-sm mb-6 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The #1 Choice for Modern Hiring
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 animate-fade-in-up delay-100">
              Find Your Next <br className="hidden md:block" />
              <span className="text-primary">Career Move</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-8 animate-fade-in-up delay-200">
              Connect with top companies and uncover opportunities that match
              your potential. No spam, just quality connections.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Button
                size="lg"
                className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                asChild>
                <NavLink to={'/app/jobs'}>
                  Start Searching <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-lg rounded-full bg-background/50 backdrop-blur-sm"
                asChild>
                <NavLink to={'/app/employer'}>Post a Job</NavLink>
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-transparent via-foreground to-transparent"></div>
          </div>
        </section>

        {/* MARQUEE SECTION */}
        <section className="py-12 border-y bg-muted/30 overflow-hidden">
          <div className="container mx-auto text-center mb-8">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Trusted by industry leaders
            </p>
          </div>
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
              <CompanyLogos />
              <CompanyLogos />
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-12 items-center">
              <CompanyLogos />
              <CompanyLogos />
            </div>
          </div>
        </section>

        {/* FEATURES SECTION WITH TABS */}
        <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking for your dream job or your next star
              employee, we've got you covered.
            </p>
          </div>

          <Tabs defaultValue="seekers" className="w-full max-w-5xl mx-auto">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-2 h-14 p-1 rounded-full bg-muted/50 border">
                <TabsTrigger
                  value="seekers"
                  className="rounded-full h-full text-base data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
                  For Job Seekers
                </TabsTrigger>
                <TabsTrigger
                  value="employers"
                  className="rounded-full h-full text-base data-[state=active]:bg-background data-[state=active]:shadow-md transition-all">
                  For Employers
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="seekers"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Search className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Smart Job Matching
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Our AI-driven algorithms connect you with roles that
                        perfectly match your skills and aspirations.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        One-Click Apply
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Save time with our unified application system. Apply to
                        dozens of top companies in seconds.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Verified Companies
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        We strictly vet all employers. No scams, no ghosts, just
                        real opportunities.
                      </p>
                    </div>
                  </div>
                  <Button className="rounded-full mt-4" size="lg" asChild>
                    <NavLink to="/app/jobs">Explore Jobs</NavLink>
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                  <div className="relative aspect-square rounded-3xl border bg-muted/50 overflow-hidden flex items-center justify-center">
                    <div className="text-center p-8">
                      <Briefcase className="h-32 w-32 mx-auto text-primary/50 mb-6" />
                      <h4 className="text-2xl font-bold">
                        10,000+ Active Roles
                      </h4>
                      <p className="text-muted-foreground">
                        Waiting for you right now.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="employers"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 md:order-1">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-20"></div>
                  <div className="relative aspect-square rounded-3xl border bg-muted/50 overflow-hidden flex items-center justify-center">
                    <div className="text-center p-8">
                      <Users className="h-32 w-32 mx-auto text-blue-500/50 mb-6" />
                      <h4 className="text-2xl font-bold">Top 5% Talent</h4>
                      <p className="text-muted-foreground">
                        Pre-screened candidates.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8 order-1 md:order-2">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Global Reach</h3>
                      <p className="text-muted-foreground text-lg">
                        Access a worldwide pool of qualified professionals ready
                        to work remotely or relocate.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Advanced Filtering
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Filter candidates by skills, experience, and even
                        culture fit scores.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Fast Hiring</h3>
                      <p className="text-muted-foreground text-lg">
                        Reduce time-to-hire by 50% with our automated scheduling
                        and communication tools.
                      </p>
                    </div>
                  </div>
                  <Button className="rounded-full mt-4" size="lg" asChild>
                    <NavLink to="/app/employer">Post a Job Free</NavLink>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[200%] bg-[radial-gradient(circle,white,transparent_70%)] opacity-30"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to shape your future?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of others who are building their careers and
              companies with us today.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full h-14 px-8 text-lg"
                asChild>
                <NavLink to="/register">Get Started Now</NavLink>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary italic">Job</span>
              <span>Portal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 JobPortal Inc. All rights reserved.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 4.01c-1 .49-1.9.63-3.12.32a5.43 5.38 0 0 0-7.88 5.61A13.92 13.92 0 0 1 1.67 3.14c-.9 3.06-.06 6.3 1.94 8.02-1.25-.04-2.2-.42-3.19-.88.16 3.4 2.8 5.75 6.1 6.55-1.55.43-3.23.18-4.14-.17.9 2.86 4.3 4.9 7.85 4.98A10.87 10.84 0 0 1 1 19.33 15.34 15.32 0 0 0 8.29 21.73c9.7 0 15.17-8.03 15.12-15.14v-.68a9.92 9.88 0 0 0 2.59-4.9z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.83 1.22 1.83 1.22 1.07 1.84 2.8 1.31 3.48 1-.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .31.22.69.82.57A12 12 0 0 0 12 .3" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
