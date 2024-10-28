import {
  BriefcaseBusiness,
  ChevronsUpDown,
  Command,
  FileText,
  LifeBuoy,
  Plus,
  Send,
  Settings2,
  UserCircle,
  Users2,
} from 'lucide-react'
import * as React from 'react'

import { CreateJob } from '@/components/job/create-job'
import { NavCompany } from '@/components/nav-company'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import { DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAppSelector } from '@/store/hooks'
import { useGetMyCompanyQuery } from '@/store/services/company.service'
import { memo } from 'react'
import { Link } from 'react-router-dom'

const data = {
  navMain: [
    {
      title: 'Jobs',
      url: '#',
      icon: BriefcaseBusiness,
      isActive: true,
      items: [
        {
          title: 'All Jobs',
          url: '/app/company/jobs', // Replace with actual route
        },
        {
          title: 'Posted Jobs',
          url: '/app/company/jobs/posted', // Route to view posted jobs
        },
        {
          title: 'Archived Jobs',
          url: '/app/company/jobs/archived', // Route to create a new job
        },
        // {
        //   title: 'Starred Jobs',
        //   url: '/app/company/jobs/starred', // Optionally view starred jobs
        // },
      ],
    },
    {
      title: 'Candidates',
      url: '#',
      icon: Users2,
      items: [
        {
          title: 'All Candidates',
          url: '/app/company/candidates', // Route to view all candidates
        },
        {
          title: 'Shortlisted',
          url: '/app/company/candidates/shortlisted', // Route to view shortlisted candidates
        },
        {
          title: 'Interview Scheduled',
          url: '/app/company/candidates/interviews', // View candidates with scheduled interviews
        },
        {
          title: 'Rejections',
          url: '/app/company/candidates/rejections', // Track rejected candidates
        },
      ],
    },
    {
      title: 'Applications',
      url: '#',
      icon: FileText,
      items: [
        {
          title: 'All Applications',
          url: '/app/company/applications', // Route to view all applications
        },
        {
          title: 'Under Review',
          url: '/app/company/applications/review', // Route for applications under review
        },
        {
          title: 'Hired',
          url: '/app/company/applications/hired', // Track hired candidates
        },
        {
          title: 'Archived',
          url: '/app/company/applications/archived', // Optionally view archived applications
        },
      ],
    },
    // {
    //   title: 'Reports',
    //   url: '#',
    //   icon: BarChart,
    //   items: [
    //     {
    //       title: 'Job Performance',
    //       url: '/app/company/reports/job-performance', // Route to view job performance reports
    //     },
    //     {
    //       title: 'Candidate Insights',
    //       url: '/app/company/reports/candidate-insights', // Route to view candidate insights
    //     },
    //   ],
    // },
    // {
    //   title: 'Support',
    //   url: '#',
    //   icon: HelpCircle,
    //   items: [
    //     {
    //       title: 'FAQ',
    //       url: '/app/company/support/faq', // Route to FAQs
    //     },
    //     {
    //       title: 'Contact Support',
    //       url: '/app/company/support/contact', // Route to contact support
    //     },
    //   ],
    // },
  ],
  createNew: {
    title: 'Create new',
    url: '#',
    icon: Plus,
    isActive: true,
    items: [
      {
        title: 'Job',
        url: '#',
      },
      {
        title: 'User',
        url: '#',
        disabled: true,
      },
    ],
  },
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  company: [
    {
      name: 'Company Profile',
      icon: UserCircle,
      url: '/app/company/profile', // Route to view company profile
    },
    {
      name: 'Company Settings',
      icon: Settings2,
      url: '/app/company/settings', // Route to manage company settings
    },
  ],
}

export const AppSidebar = memo<React.ComponentProps<typeof Sidebar>>(
  ({ ...props }) => {
    const { selectedCompany } = useAppSelector(({ company }) => company)
    const {
      data: { activeCompany },
    } = useGetMyCompanyQuery(undefined, {
      selectFromResult: ({ data, ...others }) => {
        const activeCompany = data
          ? (data?.find((company) => company._id === selectedCompany) ??
            data[0])
          : undefined
        return {
          ...others,
          data: {
            companies: data ?? [],
            activeCompany,
          },
        }
      },
    })

    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild>
                      <Link to="#">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                          <Command className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {activeCompany?.name}
                          </span>
                          <span className="truncate text-xs">Company</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                    {/* <SidebarMenuButton size='lg'> */}
                    <CreateDropDown />
                    {/* </SidebarMenuButton> */}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavCompany company={data.company} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    )
  },
)
AppSidebar.displayName = 'AppSidebar'
export const CreateDropDown = memo(() => {
  const { isMobile } = useSidebar()
  return (
    <CreateJob>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Plus className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Create new</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align="start"
          sideOffset={4}>
          {data.createNew.items?.map((item, index) => (
            <DialogTrigger asChild>
              <DropdownMenuItem
                key={item.title}
                className="gap-2 p-2"
                disabled={item.disabled}>
                <>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Command className="size-4 shrink-0" />
                  </div>
                  {item.title}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </>
              </DropdownMenuItem>
            </DialogTrigger>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </CreateJob>
  )
})
CreateDropDown.displayName = 'CreateDropDown'
export const CompaniesDropDown = () => {
  return
  /* (<DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                    <Command className='size-4' />
                  </div>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {activeCompany?.name}
                    </span>
                    <span className='truncate text-xs'>
                      {activeCompany.plan}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                align='start'
                side='bottom'
                sideOffset={4}
              >
                <DropdownMenuLabel className='text-xs text-muted-foreground'>
                  {companies?.length > 0 ? 'Companies' : 'Company'}
                </DropdownMenuLabel>
                {companies?.map((company, index) => (
                  <DropdownMenuItem
                    key={company.name}
                    onClick={() => {
                      dispatch(companySelected(company._id));
                    }}
                    className='gap-2 p-2'
                  >
                    <div className='flex size-6 items-center justify-center rounded-sm border'>
                      <Command className='size-4 shrink-0' />
                    </div>
                    {company.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className='gap-2 p-2'>
                  <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                    <Plus className='size-4' />
                  </div>
                  <div className='font-medium text-muted-foreground'>
                    Add company
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>) */
}
