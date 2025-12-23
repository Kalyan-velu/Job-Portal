'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateJobMutation } from '@/store/services/company.service'
import type { JobResponseType } from '@/types/redux'
import {
  jobTypeList,
  updateJobSchema,
  type UpdateJobInterface,
} from '@/zod-schema/job.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatDistanceToNow } from 'date-fns'
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Plus,
  X,
} from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Badge } from './ui/badge'

interface JobDetailsSheetProps {
  job: JobResponseType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'view' | 'edit'
}

const JobDetailsSheet = memo<JobDetailsSheetProps>(
  ({ job, open, onOpenChange, mode = 'view' }) => {
    const [isEditing, setIsEditing] = useState(mode === 'edit')
    const [update, { isLoading }] = useUpdateJobMutation()

    useEffect(() => {
      setIsEditing(mode === 'edit')
    }, [mode, open])

    const form = useForm<UpdateJobInterface>({
      resolver: zodResolver(updateJobSchema),
      defaultValues: {
        title: job?.title || '',
        description: job?.description || '',
        type: job?.type || 'full-time',
        location: job?.location || '',
        isArchived: job?.isArchived || false,
        salaryRange: job?.salaryRange || '',
        requirements: job?.requirements || [''],
        responsibilites: job?.responsibilites || [''],
      },
    })

    // Reset form when job changes
    useEffect(() => {
      if (job) {
        form.reset({
          title: job.title,
          description: job.description,
          type: job.type,
          location: job.location,
          isArchived: job.isArchived,
          salaryRange: job.salaryRange,
          requirements: job.requirements || [''],
          responsibilites: job.responsibilites || [''],
        })
      }
    }, [job, form])

    const handleSubmit = async (data: UpdateJobInterface) => {
      if (!job) return

      toast.loading('Updating job details...', { id: 'update-job' })
      try {
        await update({ ...data, id: job._id }).unwrap()
        toast.success('Job updated successfully!', { id: 'update-job' })
        setIsEditing(false)
      } catch (error) {
        toast.error('Failed to update job.', { id: 'update-job' })
      }
    }

    if (!job) return null

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col p-0">
          <ScrollArea className="flex-1 h-full">
            <div className="p-6 pb-24">
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-2xl font-bold tracking-tight">
                    {isEditing ? 'Edit Job Details' : 'Job Details'}
                  </SheetTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}>
                      Edit Job
                    </Button>
                  )}
                </div>
                <SheetDescription>
                  {isEditing
                    ? 'Make changes to your job posting below.'
                    : `Posted ${formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}`}
                </SheetDescription>
              </SheetHeader>

              {isEditing ? (
                <Form {...form}>
                  <form
                    id="job-update-form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jobTypeList.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    <span className="capitalize">{type}</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="salaryRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Range</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. $80k - $120k" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[150px] resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    {/* Requirements */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Requirements</h4>
                      <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                          <div className="space-y-2">
                            {field.value?.map((req, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={req}
                                  onChange={(e) => {
                                    const newReqs = [...(field.value || [])]
                                    newReqs[index] = e.target.value
                                    field.onChange(newReqs)
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newReqs = field.value?.filter(
                                      (_, i) => i !== index,
                                    )
                                    field.onChange(newReqs)
                                  }}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full border-dashed"
                              onClick={() =>
                                field.onChange([...(field.value || []), ''])
                              }>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Requirement
                            </Button>
                          </div>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Responsibilities */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Responsibilities</h4>
                      <FormField
                        control={form.control}
                        name="responsibilites"
                        render={({ field }) => (
                          <div className="space-y-2">
                            {field.value?.map((resp, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={resp}
                                  onChange={(e) => {
                                    const newResps = [...(field.value || [])]
                                    newResps[index] = e.target.value
                                    field.onChange(newResps)
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newResps = field.value?.filter(
                                      (_, i) => i !== index,
                                    )
                                    field.onChange(newResps)
                                  }}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full border-dashed"
                              onClick={() =>
                                field.onChange([...(field.value || []), ''])
                              }>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Responsibility
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-8">
                  {/* View Mode */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {job.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span className="capitalize">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salaryRange}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{job.company.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Updated{' '}
                          {formatDistanceToNow(new Date(job.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3">
                      About the Role
                    </h4>
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, i) => (
                          <Badge key={i} variant="secondary">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.responsibilites && job.responsibilites.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Responsibilities
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {job.responsibilites.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
          {isEditing && (
            <div className="p-6 border-t bg-background mt-auto">
              <SheetFooter className="flex-row gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="job-update-form"
                  disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    )
  },
)

JobDetailsSheet.displayName = 'JobDetailsSheet'
export { JobDetailsSheet }
