'use client'

import { ApplyJob } from '@/components/hub/apply-job-button'
import { JobDetailedView } from '@/components/job/job-details'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  useAppliedJobIdsQuery,
  useGetJobsQuery,
} from '@/store/services/applicant.service'
import type { PublicJobResponse } from '@/types/redux'
import { jobTypeList } from '@/zod-schema/job.schema'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, DollarSign, Filter, MapPin, Search } from 'lucide-react'
import * as React from 'react'

export function JobPortal() {
  const { data: jobs } = useGetJobsQuery()
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [filters, setFilters] = React.useState({
    search: '',
    location: '',
    type: '',
    experience: '',
    salary: [20000, 100000],
    remote: false,
  })
  const token = localStorage.getItem('token')

  const { data: appliedJobs } = useAppliedJobIdsQuery(undefined, {
    skip: !token,
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredJobs = jobs?.filter(
    (job) =>
      job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      job.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      (filters.type === '' || job.type === filters.type) &&
      (!filters.remote || job.location.toLowerCase() === 'remote'),

    // job.salary >= filters.salary[0] &&
    // job.salary <= filters.salary[1] &&
  )

  return (
    <div className="container mx-auto max-w-7xl p-4 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Find Your Dream Job</h1>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Search jobs..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Location"
              className="pl-10"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto">Search</Button>
        </div>
      </header>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-64">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="hidden md:block">
              <FilterContent
                filters={filters}
                handleFilterChange={handleFilterChange}
              />
            </CardContent>
            <CardFooter className="md:hidden">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your job search</SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <FilterContent
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </CardFooter>
          </Card>
        </aside>

        <main className="flex-grow">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs?.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                applied={appliedJobs?.includes(job.id)}
              />
            ))}
          </div>
          {filteredJobs?.length === 0 && (
            <p className="mt-8 text-center text-muted-foreground">
              No jobs found matching your criteria.
            </p>
          )}
        </main>
      </div>
    </div>
  )
}

function FilterContent({
  filters,
  handleFilterChange,
}: {
  filters: any
  handleFilterChange: (key: string, value: any) => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="job-type">Job Type</Label>
        <Select
          value={filters.type}
          onValueChange={(value) =>
            handleFilterChange('type', value === 'all' ? '' : value)
          }>
          <SelectTrigger id="job-type">
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {jobTypeList.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* <div className="space-y-2">
        <Label htmlFor="experience">Experience Level</Label>
        <Select
          value={filters.experience}
          onValueChange={(value) =>
            handleFilterChange('experience', value === 'all' ? '' : value)
          }>
          <SelectTrigger id="experience">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="entry">Entry Level</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
          </SelectContent>
        </Select>
      </div> */}
      {/* <div className="space-y-2">
        <Label>Salary Range</Label>
        <Slider
          value={filters.salary}
          onValueChange={(value) => handleFilterChange('salary', value)}
          max={200000}
          step={1000}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>${filters.salary[0] / 1000}k</span>
          <span>${filters.salary[1] / 1000}k</span>
        </div>
      </div> */}
      <div className="flex items-center space-x-2">
        <Switch
          id="remote"
          checked={filters.remote}
          onCheckedChange={(checked) => handleFilterChange('remote', checked)}
        />
        <Label htmlFor="remote">Remote Only</Label>
      </div>
    </div>
  )
}

function JobCard({
  job,
  applied,
}: {
  job: PublicJobResponse
  applied: boolean | undefined
}) {
  return (
    <JobDetailedView selectedJob={job}>
      <DialogTrigger asChild>
        <Card className="group/card flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <span className="text-xl font-bold group-hover/card:underline">
                {job.title}
              </span>
              <Badge variant="secondary">{job.type}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className={'text-xs'}>
                {formatDistanceToNow(new Date(job.postedDate), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <ApplyJob
              companyId={job.companyId}
              applied={applied}
              jobId={job.id}
            />
          </CardFooter>
        </Card>
      </DialogTrigger>
    </JobDetailedView>
  )
}
