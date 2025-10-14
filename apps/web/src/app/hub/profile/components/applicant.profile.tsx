'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateOrCreateApplicantMutation } from '@/store/services/applicant.service'
import { ApplicantSchema, type Applicant } from '@/zod-schema/applicant.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  Award,
  Briefcase,
  FileText,
  GraduationCap,
  Link,
  Linkedin,
  Phone,
  PlusCircle,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm, type FieldErrors } from 'react-hook-form'
import { toast } from 'sonner'

// ... (Zod schema definitions remain the same as before)

interface Props {
  defaultValues?: Applicant
}

export default function ApplicantProfileForm({ defaultValues }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [update, { isLoading }] = useUpdateOrCreateApplicantMutation()
  const form = useForm<Applicant>({
    resolver: zodResolver(ApplicantSchema),
    defaultValues,
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: 'education',
  })

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: 'skills',
  })

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: 'experiences',
  })

  async function onSubmit(data: Applicant) {
    setIsSubmitting(true)

    toast.loading('Updating profile', {
      id: 'applicant',
    })
    // Here you would typically send the data to your backend
    console.log(data)
    await update(data)
      .unwrap()
      .then(() => {
        toast.success('Profile Updated', {
          id: 'applicant',
          description: 'Your applicant profile has been successfully updated.',
        })
        setIsSubmitting(true)
      })
      .catch((e) => {
        setIsSubmitting(false)

        toast.error('Error', {
          id: 'applicant',
          description:
            'There was a problem updating your profile. Please try again.',
        })
      })
  }
  const onInvalid = (errors: FieldErrors<Applicant>) => {
    console.error(
      'ℹ️ ~ file: applicant.profile.tsx:102 ~ onInvalid ~ errors:',
      errors,
    )
    Object.entries(errors).map(([field, value]) => {
      toast.error(value.message)
    })
    return
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="mx-auto mt-8 max-w-4xl space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="text-2xl">Personal Information</CardTitle>
          <CardDescription className="text-blue-100">
            Provide your contact details and professional links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                {...form.register('phone')}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumeLink" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Resume Link
              </Label>
              <Input
                id="resumeLink"
                {...form.register('resumeLink')}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
              {form.formState.errors.resumeLink && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.resumeLink.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Cover Letter
            </Label>
            <Textarea
              id="coverLetter"
              {...form.register('coverLetter')}
              className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.coverLetter && (
              <p className="text-sm text-red-500">
                {form.formState.errors.coverLetter.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn Profile
            </Label>
            <Input
              id="linkedin"
              {...form.register('linkedin')}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.linkedin && (
              <p className="text-sm text-red-500">
                {form.formState.errors.linkedin.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="h-6 w-6" />
            Education
          </CardTitle>
          <CardDescription className="text-green-100">
            Add your educational background.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {educationFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 rounded-md border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`education.${index}.degree`}>Degree</Label>
                  <Input
                    id={`education.${index}.degree`}
                    {...form.register(`education.${index}.degree`)}
                  />
                  {form.formState.errors.education?.[index]?.degree && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.education[index].degree.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`education.${index}.institution`}>
                    Institution
                  </Label>
                  <Input
                    id={`education.${index}.institution`}
                    {...form.register(`education.${index}.institution`)}
                  />
                  {form.formState.errors.education?.[index]?.institution && (
                    <p className="text-sm text-red-500">
                      {
                        form.formState.errors.education[index].institution
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`education.${index}.startDate`}>
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    id={`education.${index}.startDate`}
                    {...form.register(`education.${index}.startDate`)}
                  />
                  {form.formState.errors.education?.[index]?.startDate && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.education[index].startDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`education.${index}.endDate`}>End Date</Label>
                  <Input
                    type="date"
                    id={`education.${index}.endDate`}
                    {...form.register(`education.${index}.endDate`)}
                  />
                  {form.formState.errors.education?.[index]?.endDate && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.education[index].endDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`education.${index}.description`}>
                  Description
                </Label>
                <Textarea
                  id={`education.${index}.description`}
                  {...form.register(`education.${index}.description`)}
                />
                {form.formState.errors.education?.[index]?.description && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.education[index].description.message}
                  </p>
                )}
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeEducation(index)}
                  className="mt-2 w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Education
                </Button>
              )}
            </motion.div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendEducation({
                degree: '',
                institution: '',
                startDate: new Date(),
                endDate: new Date(),
                description: '',
              })
            }
            className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-6 w-6" />
            Skills
          </CardTitle>
          <CardDescription className="text-purple-100">
            List your professional skills.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {skillFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 rounded-md border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="space-y-2">
                <Label htmlFor={`skills.${index}.name`}>Skill Name</Label>
                <Input
                  id={`skills.${index}.name`}
                  {...form.register(`skills.${index}.name`)}
                />
                {form.formState.errors.skills?.[index]?.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.skills[index].name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`skills.${index}.description`}>
                  Description
                </Label>
                <Textarea
                  id={`skills.${index}.description`}
                  {...form.register(`skills.${index}.description`)}
                />
                {form.formState.errors.skills?.[index]?.description && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.skills[index].description.message}
                  </p>
                )}
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeSkill(index)}
                  className="mt-2 w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Skill
                </Button>
              )}
            </motion.div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSkill({ name: '', description: '' })}
            className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Briefcase className="h-6 w-6" />
            Work Experience
          </CardTitle>
          <CardDescription className="text-yellow-100">
            Add your relevant work experiences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {experienceFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 rounded-md border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.title`}>
                    Job Title
                  </Label>
                  <Input
                    id={`experiences.${index}.title`}
                    {...form.register(`experiences.${index}.title`)}
                  />
                  {form.formState.errors.experiences?.[index]?.title && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.experiences[index].title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.company`}>
                    Company
                  </Label>
                  <Input
                    id={`experiences.${index}.company`}
                    {...form.register(`experiences.${index}.company`)}
                  />
                  {form.formState.errors.experiences?.[index]?.company && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.experiences[index].company.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.location`}>
                  Location
                </Label>
                <Input
                  id={`experiences.${index}.location`}
                  {...form.register(`experiences.${index}.location`)}
                />
                {form.formState.errors.experiences?.[index]?.location && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.experiences[index].location.message}
                  </p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.startDate`}>
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    id={`experiences.${index}.startDate`}
                    {...form.register(`experiences.${index}.startDate`)}
                  />
                  {form.formState.errors.experiences?.[index]?.startDate && (
                    <p className="text-sm text-red-500">
                      {
                        form.formState.errors.experiences[index].startDate
                          .message
                      }
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`experiences.${index}.endDate`}>
                    End Date
                  </Label>
                  <Input
                    type="date"
                    id={`experiences.${index}.endDate`}
                    {...form.register(`experiences.${index}.endDate`)}
                  />
                  {form.formState.errors.experiences?.[index]?.endDate && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.experiences[index].endDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.description`}>
                  Description
                </Label>
                <Textarea
                  id={`experiences.${index}.description`}
                  {...form.register(`experiences.${index}.description`)}
                />
                {form.formState.errors.experiences?.[index]?.description && (
                  <p className="text-sm text-red-500">
                    {
                      form.formState.errors.experiences[index].description
                        .message
                    }
                  </p>
                )}
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeExperience(index)}
                  className="mt-2 w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Experience
                </Button>
              )}
            </motion.div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendExperience({
                title: '',
                company: '',
                location: '',
                startDate: new Date(),
                endDate: new Date(),
                description: '',
              })
            }
            className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button
            type="submit"
            className="w-full text-lg font-semibold"
            disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
