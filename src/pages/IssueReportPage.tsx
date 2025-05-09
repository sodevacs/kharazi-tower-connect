
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppContext } from '../context/AppContext';
import { TOWERS, ISSUE_TYPES } from '../data/constants';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  towerId: z.string({ required_error: 'انتخاب برج الزامی است' }),
  issueTypeId: z.string({ required_error: 'انتخاب نوع مشکل الزامی است' }),
  details: z.string().optional(),
  fullName: z.string().min(3, { message: 'نام و نام خانوادگی باید حداقل 3 کاراکتر باشد' }),
  unitNumber: z.string().min(1, { message: 'شماره واحد الزامی است' }),
  phoneNumber: z.string().min(10, { message: 'شماره تلفن باید حداقل 10 رقم باشد' }),
});

type FormData = z.infer<typeof formSchema>;

const IssueReportPage: React.FC = () => {
  const { addIssueReport } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      towerId: '',
      issueTypeId: '',
      details: '',
      fullName: '',
      unitNumber: '',
      phoneNumber: '',
    },
  });
  
  const selectedIssueType = ISSUE_TYPES.find(
    type => type.id === form.watch('issueTypeId')
  );
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      addIssueReport(data);
      form.reset();
      toast.success('گزارش خرابی شما با موفقیت ثبت شد');
    } catch (error) {
      toast.error('خطا در ثبت گزارش');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="card-shadow">
        <CardHeader className="bg-primary-lighter">
          <CardTitle className="text-2xl text-center text-gray-800">
            فرم گزارش خرابی
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            لطفا فرم زیر را برای گزارش مشکلات زیرساختی تکمیل نمایید
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="towerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>انتخاب برج</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="برج خود را انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TOWERS.map((tower) => (
                          <SelectItem key={tower.id} value={tower.id}>
                            {tower.name}
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
                name="issueTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع مشکل</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="نوع مشکل را انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ISSUE_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(selectedIssueType?.requiresDetails || form.watch('details')) && (
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>توضیحات بیشتر</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="توضیحات بیشتر درباره مشکل را وارد کنید"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام و نام خانوادگی</FormLabel>
                    <FormControl>
                      <Input placeholder="نام و نام خانوادگی خود را وارد کنید" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unitNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره واحد</FormLabel>
                    <FormControl>
                      <Input placeholder="شماره واحد خود را وارد کنید" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره تماس</FormLabel>
                    <FormControl>
                      <Input placeholder="شماره تماس خود را وارد کنید" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'در حال ارسال...' : 'ارسال گزارش'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueReportPage;
