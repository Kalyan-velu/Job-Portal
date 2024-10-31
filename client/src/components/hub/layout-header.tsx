import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Search } from 'lucide-react'
import { memo, type Dispatch, type SetStateAction } from 'react'

interface Props {
  handleFilterChange: (key: string, value: string) => void
  filters: { search: string; type: string }
  setFilters: Dispatch<SetStateAction<{ search: string; type: string }>>
}

const HubLayoutHeader = memo<Props>(({ filters, handleFilterChange }) => {
  return (
    <header className="bg-secondary py-12 text-secondary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">Find Your Dream Job</h1>
        <p className="mb-8 text-xl">
          Discover opportunities that match your skills and aspirations
        </p>
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
          <Input
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full sm:w-96"
          />
          <Button className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </header>
  )
})
HubLayoutHeader.displayName = 'HubLayoutHeader'

export { HubLayoutHeader }
