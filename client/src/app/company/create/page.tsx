import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCompanyyMutation } from '@/store/services/company.service';
import {
  CompanySchema,
  type CompanySchemaFieldType,
  type CompanyType,
} from '@/zod-schema/company.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const steps = [
  { id: 'step-1', name: 'Basic Info' },
  { id: 'step-2', name: 'Description' },
  { id: 'step-3', name: 'Contact' },
];
const stepFields: CompanySchemaFieldType[][] = [
  ['name', 'industry', 'companySize'],
  ['description'],
  ['siteUrl', 'email', 'phone', 'socialMedia'],
];

const CreateCompanyProfile = memo(() => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const [createCompany, { isLoading }] = useCreateCompanyyMutation();
  const form = useForm<CompanyType>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      name: '',
      industry: '',
      companySize: '1-10',
      description: '',
      siteUrl: '',
      email: '',
      phone: '',
    },
  });
  const nextStep = async () => {
    const isValid = await form.trigger(stepFields[currentStep] as any);
    if (isValid) {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };
  const onSubmit = async (data: CompanyType) => {
    console.log(data);
    await createCompany(data)
      .unwrap()
      .then((r) => {
        console.debug('ℹ️ ~ file: page.tsx:72 ~ .then ~ r:', r);
        navigate('/app/company/dashboard');
        toast.success(r);
      })
      .catch((e) => {
        toast.error(e);
      });
  };
  const onInvalidSubmit = async (data: FieldErrors<CompanyType>) => {
    return console.error(
      'ℹ️ ~ file: page.tsx:69 ~ onInvalidSubmit ~ data:',
      data
    );
  };

  return (
    <div className='w-full h-full mx-auto max-w-screen-md p-4'>
      {' '}
      <h2 className={'text-3xl font-semibold text-center py-4 pb-6'}>
        Create your company profile
      </h2>
      <nav aria-label='Progress'>
        <ol
          role='list'
          className='space-y-4 md:flex md:space-y-0 md:space-x-8'
        >
          {steps.map((step, index) => (
            <li
              key={step.name}
              className='md:flex-1'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentStep(index);
              }}
            >
              <div
                className={`group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4
                  ${
                    index <= currentStep
                      ? 'border-blue-500 text-primary'
                      : 'border-gray-200 text-gray-500'
                  }`}
              >
                <span className='text-sm font-medium normal-case'>
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
          className='space-y-6 min-h-[calc(100dvh_-_20dvh)] h-full my-auto mt-8'
        >
          {currentStep === 0 && (
            <>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Acme Inc.'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='estd'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ESTD.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='eg.1970'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='industry'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select an industry' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='tech'>Technology</SelectItem>
                        <SelectItem value='finance'>Finance</SelectItem>
                        <SelectItem value='healthcare'>Healthcare</SelectItem>
                        <SelectItem value='education'>Education</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='companySize'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select company size' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1-10'>1-10 employees</SelectItem>
                        <SelectItem value='1-50'>1-50 employees</SelectItem>
                        {/* <SelectItem value='1-200'>1-200 employees</SelectItem> */}
                        <SelectItem value='1000<'>
                          {'1000<'} employees
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {currentStep === 1 && (
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tell us about your company...'
                      className='resize-none min-h-44'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your company (max 500
                    characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {currentStep === 2 && (
            <>
              <FormField
                control={form.control}
                name='siteUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        type='url'
                        placeholder='https://www.example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='contact@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input
                        type='tel'
                        placeholder='+1 (555) 000-0000'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className='flex justify-between space-x-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                type='button'
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button type='submit'>Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
});
CreateCompanyProfile.displayName = 'CreateCompanyProfile';
export { CreateCompanyProfile };
