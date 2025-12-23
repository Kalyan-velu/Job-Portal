import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Building2, Users } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const EmployerDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-8 animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Employer Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your jobs, applications, and company profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Job Postings Section */}
        <Card className="shadow-lg border bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Job Postings</CardTitle>
            <Briefcase className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Create and manage your active job listings.
            </p>
            <Button className="w-full rounded-full" asChild>
              <Link to={'/app/employer/jobs/active'}>View Jobs</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Applications Section */}
        <Card className="shadow-lg border bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Applications</CardTitle>
            <Users className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Review candidates and manage applications.
            </p>
            <Button className="w-full rounded-full" variant="secondary" asChild>
              <Link to={'/app/employer/applications'}>View Applications</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Company Profile Section */}
        <Card className="shadow-lg border bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Company Profile</CardTitle>
            <Building2 className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Update your company branding and details.
            </p>
            <Button className="w-full rounded-full" variant="outline" asChild>
              <Link to={'/app/employer/profile'}>Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployerDashboard
