
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/Rating';

const ratingSchema = z.object({
  name: z.string().min(2, { message: 'نام حداقل باید شامل ۲ کاراکتر باشد' }),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type RatingFormData = z.infer<typeof ratingSchema>;

const RateExpertsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratings, setRatings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      name: '',
      rating: 0,
      comment: '',
    },
  });
  
  useEffect(() => {
    fetchRatings();
  }, []);
  
  const fetchRatings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('public_ratings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching ratings:', error);
        return;
      }
      
      setRatings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (data: RatingFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('public_ratings')
        .insert([
          { 
            name: data.name,
            rating: data.rating, 
            comment: data.comment || null 
          }
        ]);
      
      if (error) {
        toast.error('خطا در ثبت نظر');
        console.error('Error submitting rating:', error);
        return;
      }
      
      toast.success('نظر شما با موفقیت ثبت شد');
      form.reset({
        name: '',
        rating: 0,
        comment: '',
      });
      
      // Refresh ratings
      fetchRatings();
      
    } catch (error) {
      toast.error('خطا در ارتباط با سرور');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <Card className="card-shadow">
        <CardHeader className="bg-primary-lighter">
          <CardTitle className="text-2xl text-center text-gray-800">
            نظرسنجی کاربران
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            نظر خود را درباره خدمات مجتمع برج‌های خرازی ثبت کنید
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">نام شما</FormLabel>
                    <FormControl>
                      <Input placeholder="نام خود را وارد کنید" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">امتیاز شما</FormLabel>
                    <FormControl>
                      <Rating
                        value={field.value}
                        onChange={field.onChange}
                      />
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
                    <FormLabel className="font-bold">نظر شما</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="نظر خود را بنویسید (اختیاری)" 
                        className="resize-none" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full font-bold" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'در حال ثبت...' : 'ثبت نظر'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="card-shadow">
        <CardHeader className="bg-primary-lighter">
          <CardTitle className="text-xl text-center text-gray-800">
            نظرات کاربران دیگر
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center text-gray-500">در حال بارگذاری نظرات...</p>
          ) : ratings.length > 0 ? (
            <div className="space-y-6">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{rating.name}</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-500 text-lg">
                          {star <= rating.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="mt-2 text-gray-700">{rating.comment}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(rating.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">هنوز نظری ثبت نشده است</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RateExpertsPage;
