'use client'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMyApplicationsQuery } from '@/store/services/applicant.service'
import { Search } from 'lucide-react'
import React from 'react'

// This would typically come from an API call
// const mockApplications = [
//   {
//     id: 1,
//     jobTitle: 'Software Engineer',
//     company: 'TechCorp',
//     status: 'Pending',
//     appliedDate: '2023-10-15',
//   },
//   {
//     id: 2,
//     jobTitle: 'Product Manager',
//     company: 'InnovateCo',
//     status: 'Interviewed',
//     appliedDate: '2023-10-10',
//   },
//   {
//     id: 3,
//     jobTitle: 'UX Designer',
//     company: 'DesignHub',
//     status: 'Rejected',
//     appliedDate: '2023-10-05',
//   },
//   {
//     id: 4,
//     jobTitle: 'Data Analyst',
//     company: 'DataDrive',
//     status: 'Offered',
//     appliedDate: '2023-09-30',
//   },
//   {
//     id: 5,
//     jobTitle: 'Marketing Specialist',
//     company: 'BrandBoost',
//     status: 'Pending',
//     appliedDate: '2023-09-25',
//   },
// ]

export default function ApplicantApplications() {
  const { data: applications } = useMyApplicationsQuery()
  const [filters, setFilters] = React.useState({ search: '', status: '' })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredApplications = applications?.filter(
    (app) =>
      app.jobTitle.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.status === '' || app.status === filters.status),
  )

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-3xl font-bold">My Applications</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
          <CardDescription>Overview of your job applications</CardDescription>
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
                {applications?.filter((app) => app.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {
                  applications?.filter((app) => app.status === 'interviewed')
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">Interviewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {applications?.filter((app) => app.status === 'offered').length}
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
            placeholder="Search applications?..."
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
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Interviewed">Interviewed</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Offered">Offered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                {/* <TableHead>Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications?.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.jobTitle}
                  </TableCell>
                  <TableCell>{application.company.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        application.status === 'pending'
                          ? 'default'
                          : application.status === 'interviewed'
                            ? 'secondary'
                            : application.status === 'rejected'
                              ? 'destructive'
                              : 'outline'
                      }>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{application.appliedDate}</TableCell>
                  {/* <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell> */}
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
