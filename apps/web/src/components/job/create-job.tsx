import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateJobMutation } from '@/store/services/company.service'
import {
  JobSchema,
  jobTypeEnum,
  type JobInterface,
} from '@/zod-schema/job.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  type FieldErrors,
} from 'react-hook-form'
import { toast } from 'sonner'

interface CreateJobProps {
  children: ReactNode
}

export const CreateJob: React.FC<CreateJobProps> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [create, { isLoading }] = useCreateJobMutation()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobInterface>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      requirements: [''],
      responsibilites: [''],
    },
  })

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: 'requirements',
  })

  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({
    control,
    name: 'responsibilites',
  })

  const onSubmit = async (data: JobInterface) => {
    if (isLoading) return
    await create(data)
      .unwrap()
      .then((r) => {
        console.debug('ℹ️ ~ file: create-job.tsx:77 ~ .then ~ r:', r)
        toast.success('Job created successfully.')
        setOpen(false)
      })
      .catch((e) => {
        console.error('ℹ️ ~ file: create-job.tsx:78 ~ awaitcreateJob ~ e:', e)
        return {}
      })
    // Handle form submission here
  }
  const onInvalidSubmit = async (data: FieldErrors<JobInterface>) => {
    console.debug(
      'ℹ️ ~ file: create-job.tsx:74 ~ onInvalidSubmit ~ data:',
      data,
    )
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="max-h-[calc(100dvh_-_15dvh)] sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Create a job</DialogTitle>
          <DialogDescription>
            Fill the form to create a job posting.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[calc(100dvh_-_15dvh_-_25dvh)] overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
            className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" {...register('description')} />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypeEnum.options.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className={'capitalize'}>
                          {type.replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register('location')} />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary Range (Optional)</Label>
              <Input id="salaryRange" {...register('salaryRange')} />
              {errors.salaryRange && (
                <p className="text-sm text-red-500">
                  {errors.salaryRange.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Requirements</Label>
              {requirementFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input {...register(`requirements.${index}`)} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRequirement(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendRequirement('')}>
                Add Requirement
              </Button>
              {errors.requirements && (
                <p className="text-sm text-red-500">
                  {errors.requirements.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Responsibilities</Label>
              {responsibilityFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input {...register(`responsibilites.${index}`)} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeResponsibility(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendResponsibility('')}>
                Add Responsibility
              </Button>
              {errors.responsibilites && (
                <p className="text-sm text-red-500">
                  {errors.responsibilites.message}
                </p>
              )}
            </div>
          </form>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit, onInvalidSubmit)}>
            Create Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
