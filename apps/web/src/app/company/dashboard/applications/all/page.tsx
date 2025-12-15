'use client'

import { ApplicantDetailedView } from '@/components/application/application-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/ui/tooltip'
import { useCompanyApplicationsQuery, useUpdateApplicationStatusMutation, } from '@/store/services/company.service' // Adjust API hook
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { Archive, CalendarCheck2, Search } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

// Status options for filtering applications
const applicationStatus = [
  'submitted',
  'under review',
  'interview scheduled',
  'offer extended',
  'rejected',
] as const

export default function EmployerApplications() {
  const { data: applications } = useCompanyApplicationsQuery()
  const [filters, setFilters] = React.useState({ search: '', status: '' })
  const [updateStatus, { isLoading }] = useUpdateApplicationStatusMutation()
  const [note, setNote] = useState('')
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredApplications = applications?.filter(
    (app) =>
      app.jobId.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.status === '' || app.applicationStatus === filters.status),
  )

  const handleStatusChange = async ({
    status,
    applicationId,
  }: {
    status: (typeof applicationStatus)[number]
    applicationId: string
  }) => {
    toast.loading('Changing application status', { id: 'status' })
    await updateStatus({ applicationId, newStatus: status, note })
      .unwrap()
      .then(() => {
        toast.success('Application status updated', { id: 'status' })
      })
      .catch((e) => {
        toast.error("Couldn't update application status", { id: 'status' })
      })
  }

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Job Applications</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Applications Overview</CardTitle>
          <CardDescription>
            Summary of received applications for posted jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{applications?.length}</div>
              <div className="text-sm text-muted-foreground">
                Total Applications
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {
                  applications?.filter(
                    (app) => app.applicationStatus === 'submitted',
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {
                  applications?.filter(
                    (app) => app.applicationStatus === 'interview scheduled',
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">
                Interview Scheduled
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {
                  applications?.filter(
                    (app) => app.applicationStatus === 'offer extended',
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Offers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder="Search by applicant name..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            handleFilterChange('status', value === 'all' ? '' : value)
          }>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {applicationStatus.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications?.map((application) => (
                <TableRow key={application._id}>
                  <TableCell className="font-medium">
                    {application.applicantId.name}
                  </TableCell>
                  <TableCell>{application.applicantId.email}</TableCell>
                  <TableCell>{application.jobId.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        application.applicationStatus === 'submitted'
                          ? 'default'
                          : application.applicationStatus ===
                              'interview scheduled'
                            ? 'secondary'
                            : application.applicationStatus === 'rejected'
                              ? 'destructive'
                              : 'outline'
                      }>
                      {application.applicationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.appliedAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <TooltipProvider>
                      <ApplicantDetailedView applicationId={application._id}>
                        <Tooltip>
                          <DialogTrigger asChild>
                            <TooltipTrigger>
                              <Button variant={'outline'} size={'icon'}>
                                <EyeOpenIcon />
                              </Button>
                            </TooltipTrigger>
                          </DialogTrigger>
                          <TooltipContent>View Application</TooltipContent>
                        </Tooltip>
                      </ApplicantDetailedView>

                      <Dialog>
                        <Tooltip>
                          <DialogTrigger asChild>
                            <TooltipTrigger>
                              <Button
                                // onClick={(e) => e.stopPropagation()}
                                variant={'outline'}
                                size={'icon'}>
                                <CalendarCheck2 />
                              </Button>
                            </TooltipTrigger>
                          </DialogTrigger>
                          <TooltipContent>Schedule Interview</TooltipContent>
                        </Tooltip>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader className="rounded-t-lg bg-gray-100">
                            <DialogTitle className="text-xl font-bold text-gray-800">
                              Employer's Note
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-gray-600">
                              Add your note below. Click "Save" when you're
                              done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col items-start gap-4">
                            <Label
                              htmlFor="note"
                              className="text-right font-semibold text-gray-700">
                              Note
                            </Label>
                            <Textarea
                              id="note"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              className="col-span-3 rounded-lg border border-gray-400 p-2 focus:outline-none focus:ring focus:ring-blue-500"
                              placeholder="Type your note here..."
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() =>
                                handleStatusChange({
                                  applicationId: application._id,
                                  status: 'interview scheduled',
                                })
                              }
                              type="submit">
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            onClick={() =>
                              handleStatusChange({
                                status: 'rejected',
                                applicationId: application._id,
                              })
                            }
                            variant={'outline'}
                            size={'icon'}>
                            <Archive />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reject</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredApplications?.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          No applications found matching your criteria.
        </p>
      )}
    </div>
  )
}