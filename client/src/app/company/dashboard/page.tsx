import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React from 'react'
import { Link } from 'react-router-dom'

const EmployerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-4 text-3xl font-semibold text-gray-800">
        Employer Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Job Postings Section */}
        <Card className="p-4 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Job Postings</h2>
          <p className="text-gray-600">Manage your job listings.</p>
          <Button className="mt-4" variant="default">
            <Link to={'/company/jobs/active'}>View Job Postings</Link>
          </Button>
        </Card>

        {/* Applications Section */}
        <Card className="p-4 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Applications</h2>
          <p className="text-gray-600">Review and manage job applications.</p>
          <Button className="mt-4" variant="default">
            <Link to={'/app/company/applications'}>View Applications</Link>
          </Button>
        </Card>

        {/* Company Profile Section */}
        <Card className="p-4 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            Company Profile
          </h2>
          <p className="text-gray-600">Manage your company details.</p>
          <Button className="mt-4" variant="default">
            <Link to={'/app/company/profile'}>Edit Profile</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default EmployerDashboard
