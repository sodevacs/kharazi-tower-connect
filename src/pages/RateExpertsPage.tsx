
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../context/AppContext';
import { EXPERTS } from '../data/constants';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  expertId: z.string({ required_error: 'انتخاب کارشناس الزامی است' }),
  rating: z.string({ required_error: 'امتیاز الزامی است' }),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const RateExpertsPage: React.FC = () => {
  const { addRating } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expertId: '',
      rating: '',
      comment: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      addRating({
        expertId: data.expertId,
        rating: parseInt(data.rating),
        comment: data.comment,
      });
      form.reset();
      toast.success('نظر شما با موفقیت ثبت شد');
    } catch (error) {
      toast.error('خطا در ثبت نظر');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="card-shadow">
        <CardHeader className="bg-primary-lighter">
          <CardTitle className="text-2xl text-center text-gray-800">
            امتیازدهی به کارشناسان
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            نظر خود را در مورد عملکرد کارشناسان ثبت کنید
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="expertId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>انتخاب کارشناس</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="کارشناس مورد نظر را انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPERTS.map((expert) => (
                          <SelectItem key={expert.id} value={expert.id}>
                            {expert.name}
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
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>امتیاز</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex justify-between"
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <FormItem
                            key={value}
                            className="flex flex-col items-center space-y-2"
                          >
                            <FormLabel className="text-lg font-medium">
                              {value}
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem value={value.toString()} />
                            </FormControl>
                            <FormLabel className="text-xs text-muted-foreground">
                              {value === 5 ? 'عالی' :
                                value === 4 ? 'خوب' :
                                value === 3 ? 'متوسط' :
                                value === 2 ? 'ضعیف' : 'خیلی ضعیف'}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>توضیحات (اختیاری)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="توضیحات خود را وارد کنید"
                        {...field}
                        className="min-h-[100px]"
                      />
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
                {isSubmitting ? 'در حال ثبت...' : 'ثبت نظر'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateExpertsPage;
