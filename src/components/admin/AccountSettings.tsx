
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../../context/AppContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'نام باید حداقل 2 کاراکتر باشد' }),
  username: z.string().min(3, { message: 'نام کاربری باید حداقل 3 کاراکتر باشد' }),
  newPassword: z.string().min(6, { message: 'رمز عبور باید حداقل 6 کاراکتر باشد' }).or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

const AccountSettings: React.FC = () => {
  const { currentUser, updateUser } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || '',
      username: currentUser?.username || '',
      newPassword: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: Record<string, string> = {
        name: data.name,
        username: data.username,
      };
      
      // Only update password if a new one was provided
      if (data.newPassword) {
        updateData.password = data.newPassword;
      }
      
      updateUser(currentUser.id, updateData);
      
      form.setValue('newPassword', '');
      toast.success('اطلاعات حساب کاربری به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی اطلاعات');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>تنظیمات حساب کاربری</CardTitle>
        <CardDescription>
          اطلاعات حساب کاربری خود را ویرایش کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام کاربری</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز عبور جدید (اختیاری)</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="خالی بگذارید اگر تغییر نمی‌دهید" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="mt-4" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی اطلاعات'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
