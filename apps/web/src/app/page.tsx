import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button.tsx'
import { ModeToggle } from '@/components/ui/theme-toggle.tsx'

export default function Home() { return (
  <>
    <header className={' sticky top-0 z-50'}>
      <nav className={'flex max-w-7xl mx-auto justify-between items-center p-4'}>
        <NavLink to={'/'} aria-label={'Logo or Home Page Link'} className={'text-xl flex flex-col leading-none font-bold '}>
      <span>
        Your
      </span>
          <span>
        Next
       </span>
        </NavLink>
        <div className=" hidden lg:flex items-center border border-gray-200 drop-shadow rounded-full px-8 py-2">
          <ul aria-label={'navigation-list'} className={'flex text-sm gap-4'}>
            <li>
              <NavLink to={"/"} className={({isActive})=>isActive?'text-primary font-semibold':'text-gray-700 dark:text-gray-400'}>Home
              </NavLink>
            </li>
            {/*<li>*/}
            {/*  <NavLink to={"/hub"} className={({isActive})=>isActive?'text-primary font-semibold':'text-gray-700 dark:text-gray-400'}>*/}
            {/*    About*/}
            {/*  </NavLink>*/}
            {/*</li>*/}
            <li>
              <NavLink to={'/app/jobs'} className={({isActive})=>isActive?'text-primary font-semibold':'text-gray-700 dark:text-gray-400'}>
                Find Jobs
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-x-2">
          <ModeToggle/>
          <Button variant={'outline'} asChild>
            <NavLink to={"/app/employer"}>
              Post a Job
            </NavLink>
          </Button>
        </div>
      </nav>
    </header>
    <section className={'flex flex-col px-4 items-center justify-center gap-4 py-32'}>
      <h1 className={'text-center font-bold text-4xl lg:text-5xl'}>Find Your Dream Job. Faster.</h1>
      <p className={'text-center max-w-xl text-lg lg:text-xl mt-6 text-black/80 dark:text-foreground/80'}>The smarter way to connect with companies that actually want you.
        Browse verified openings, apply in seconds, and get hired — no spam, no black holes.</p>
      <div className="flex items-center justify-center mt-8 gap-x-2">
        <Button variant={'outline'} size={'lg'} asChild>
          <NavLink to={'/app/jobs'}>
            Find Jobs
          </NavLink>
        </Button>
        <Button size={'lg'} asChild>
          <NavLink to={'/app/employer'}>
            Want to Post a Job?
          </NavLink>
        </Button>
      </div>
    </section>
  </>

) }
