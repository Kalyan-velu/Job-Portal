'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateJobMutation } from '@/store/services/company.service'
import type { JobResponseType } from '@/types/redux'
import {
  jobTypeList,
  updateJobSchema,
  type UpdateJobInterface,
} from '@/zod-schema/job.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { memo, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface JobDialogProps {
  children?: ReactNode
  job: JobResponseType
}

const JobUpdateDialog = memo<JobDialogProps>(({ children, job }) => {
  const [open, setOpen] = useState(false)
  const [update, { isLoading }] = useUpdateJobMutation()
  const form = useForm<UpdateJobInterface>({
    resolver: zodResolver(updateJobSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      type: job.type,
      location: job.location,
      isArchived: job.isArchived,
      salaryRange: job.salaryRange,
      requirements: job.requirements || [''],
      responsibilites: job.responsibilites || [''],
    },
  })

  const handleSubmit = async (data: UpdateJobInterface) => {
    try {
      toast.loading('Updating job details.', { id: 'job' })
      await update({ ...data, id: job._id })
        .unwrap()
        .then(() => {
          toast.success('Job details updated.', { id: 'job' })
        })
        .catch(() => {
          toast.error("Couldn't update job.", { id: 'job' })
        })
      setOpen(false)
    } catch (error) {
      console.error('Failed to update job:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ?? (
        <DialogTrigger asChild>
          <Button variant="outline">Edit Job</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Job: {job.title}</DialogTitle>
          <DialogDescription>
            Make changes to the job posting details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobTypeList.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
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
            <FormField
              control={form.control}
              name="salaryRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
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
                            variant="outline"
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
                        className="w-full"
                        onClick={() =>
                          field.onChange([...(field.value || []), ''])
                        }>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Requirement
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsibilites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities</FormLabel>
                  <FormControl>
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
                            variant="outline"
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
                        className="w-full"
                        onClick={() =>
                          field.onChange([...(field.value || []), ''])
                        }>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Responsibility
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Update Job
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

JobUpdateDialog.displayName = 'JobUpdateDialog'

export { JobUpdateDialog }
