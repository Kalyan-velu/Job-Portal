import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, type FieldErrors } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateMyCompanyMutation } from '@/store/services/company.service'
import { CompanySchema, type CompanyType } from '@/zod-schema/company.schema'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

// const editableFields: (keyof CompanyType)[] = [
//   'industry',
//   'siteUrl',
//   'companySize',
//   'based',
//   'description',
//   'socialMedia',
//   'phone',
// ];

export const CompanyProfileForm = ({
  initialData,
}: {
  initialData: CompanyType | undefined
}) => {
  const [update, { isLoading }] = useUpdateMyCompanyMutation()
  const form = useForm<CompanyType>({
    resolver: zodResolver(CompanySchema),
    //@ts-expect-error estd is actually number when got from server
    defaultValues: initialData
      ? {
          ...initialData,
          estd: initialData?.estd?.toString(),
        }
      : undefined,
  })

  async function onSubmit(data: CompanyType) {
    try {
      toast.loading('Updating job details.', { id: 'job' })
      await update({ ...data })
        .unwrap()
        .then(() => {
          toast.success('Job details updated.', { id: 'job' })
        })
        .catch(() => {
          toast.error("Couldn't update job.", { id: 'job' })
        })
    } catch (error) {
      console.error('Failed to update job:', error)
    }
    // Here you would typically send the data to your backend
  }
  function onInvalidSubmit(data: FieldErrors<CompanyType>) {
    console.debug(
      'ℹ️ ~ file: company-form.tsx:59 ~ onInvalidSubmit ~ data:',
      data,
    )
  }
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className={'text-2xl'}>Update Company Profile</CardTitle>
        <CardDescription>
          Update your company's information. Fields marked with an asterisk (*)
          are required. Some fields are not editable and are shown for reference
          only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
            className="grid grid-cols-2 gap-4">
            <div className={'flex w-full flex-col gap-y-2 p-2'}>
              <div>
                <h3 className="text-lg font-medium">Basic Information</h3>
                <p className="text-sm text-muted-foreground">
                  This section contains your company's core details.
                </p>
              </div>
              <Separator />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      This field cannot be edited.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL *</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={'flex w-full flex-col gap-y-2 p-2'}>
              <div>
                <h3 className="text-lg font-medium">Company Details</h3>
                <p className="text-sm text-muted-foreground">
                  Provide more specific information about your company.
                </p>
              </div>
              <Separator />

              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="1-50">1-50</SelectItem>
                        <SelectItem value="1-100">1-100</SelectItem>
                        <SelectItem value="1000<">1000+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="based"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Based In</FormLabel>
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
            </div>
            <div className={'col-span-2 flex w-full flex-col gap-y-2 p-2'}>
              <div>
                <h3 className="text-lg font-medium">
                  Social Media and Contact
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add your social media links and contact information.
                </p>
              </div>
              <Separator />

              <SocialMediaLinks control={form.control} name="socialMedia" />

              <FormField
                control={form.control}
                name="estd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Established Year</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" disabled />
                    </FormControl>
                    <FormDescription>
                      This field cannot be edited.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled />
                    </FormControl>
                    <FormDescription>
                      This field cannot be edited.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isLoading}
                type="submit"
                className={'mt-4 w-fit self-end'}>
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function SocialMediaLinks({ control, name }: { control: any; name: string }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  })

  return (
    <div>
      {fields.map((field, index) => (
        <FormField
          control={control}
          key={field.id}
          name={`${name}.${index}.url`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={index !== 0 ? 'sr-only' : undefined}>
                Social Media Link
              </FormLabel>
              <FormDescription className={index !== 0 ? 'sr-only' : undefined}>
                Add your company's social media links
              </FormDescription>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input {...field} placeholder="https://example.com" />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove link</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ url: '' })}>
        <Plus className="mr-2 h-4 w-4" />
        Add Link
      </Button>
    </div>
  )
}
