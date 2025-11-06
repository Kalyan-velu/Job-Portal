import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from '@/store/actions/auth.action'
import { useAppDispatch } from '@/store/hooks'
import { useGetUserQuery } from '@/store/services/user.service'
import { Briefcase, ChevronDown, LogOut, Menu, User } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ApplicantNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const navigate = useNavigate()
  return (
    <nav className="sticky top-0 z-30  shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <Briefcase className="h-8 w-8 text-blue-500" />
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/app/jobs"
                  className="rounded-md px-3 py-2 text-sm font-medium ">
                  Find Jobs
                </Link>
                <Link
                  to="/app/jobs/my-applications"
                  className="rounded-md px-3 py-2 text-sm font-medium ">
                  My Applications
                </Link>
                {/* <a
                  href="/saved-jobs"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Saved Jobs
                </a> */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search jobs"
                  className="block w-full rounded-md border border-gray-400 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <Button variant="ghost" size="icon" className="ml-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="sr-only">Notifications</span>
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-3 flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-sm font-medium ">
                      {user?.name}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 " />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      navigate('/app/jobs/profile')
                    }}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>My Resume</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Saved Jobs</span>
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      localStorage.removeItem('token')
                      localStorage.removeItem('role')
                      dispatch(logout())
                      return navigate('/login')
                    }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden ">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              to="/app/jobs"
              className="rounded-md px-3 py-2 text-sm font-medium ">
              Find Jobs
            </Link>
            <Link
              to="/app/jobs/my-applications"
              className="rounded-md px-3 py-2 text-sm font-medium ">
              My Applications
            </Link>
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium ">
                  {user?.name}
                </div>
                <div className="text-sm font-medium text-foregroud-muted">
                  {user?.email}
                </div>
              </div>
              {/* <Button variant="ghost" size="icon" className="ml-auto">
                <Bell className="h-6 w-6 text-gray-400" />
                <span className="sr-only">Notifications</span>
              </Button> */}
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Link
                to="/app/jobs/profile"
                className="block rounded-md px-3 py-2 text-base font-medium ">
                Profile
              </Link>
              {/* <a
                href="/resume"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                My Resume
              </a>
              <a
                href="/saved-jobs"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Saved Jobs
              </a>
              <a
                href="/settings"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Settings
              </a> */}
              <Button
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('role')
                  dispatch(logout())
                  return navigate('/login')
                }}
                className="block rounded-md px-3 py-2 text-base font-medium ">
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}