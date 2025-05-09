
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../context/AppContext';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  username: z.string().min(1, { message: 'نام کاربری الزامی است' }),
  password: z.string().min(1, { message: 'رمز عبور الزامی است' }),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const { login, currentUser, lockedUntil } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/admin');
    }
  }, [currentUser, navigate]);
  
  // Handle locked account countdown
  useEffect(() => {
    if (!lockedUntil) {
      setTimeLeft(null);
      return;
    }
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((lockedUntil.getTime() - now.getTime()) / 1000));
      return diff;
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lockedUntil]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    if (timeLeft && timeLeft > 0) {
      toast.error(`حساب کاربری قفل شده است. لطفاً ${timeLeft} ثانیه دیگر تلاش کنید.`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(data.username, data.password);
      
      if (success) {
        toast.success('ورود موفقیت‌آمیز');
        navigate('/admin');
      } else {
        toast.error('نام کاربری یا رمز عبور نادرست است');
      }
    } catch (error) {
      toast.error('خطا در ورود به سیستم');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <Card className="card-shadow">
        <CardHeader className="bg-primary-lighter">
          <CardTitle className="text-2xl text-center text-gray-800">
            ورود به پنل مدیریت
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            لطفا نام کاربری و رمز عبور خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {timeLeft && timeLeft > 0 ? (
            <div className="p-4 mb-4 text-center bg-red-50 text-red-700 rounded-md">
              حساب کاربری قفل شده است. لطفاً {timeLeft} ثانیه دیگر تلاش کنید.
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نام کاربری</FormLabel>
                      <FormControl>
                        <Input placeholder="نام کاربری خود را وارد کنید" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز عبور</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="رمز عبور خود را وارد کنید" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isSubmitting || (timeLeft && timeLeft > 0)}
                >
                  {isSubmitting ? 'در حال ورود...' : 'ورود به سیستم'}
                </Button>
              </form>
            </Form>
          )}
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>برای اطلاعات ورود دمو:</p>
            <ul className="mt-1">
              <li>مدیر کل: admin</li>
              <li>مدیر برج B1: manager1</li>
              <li>مدیر برج B2 و B8: manager2</li>
            </ul>
            <p className="mt-1">(در نسخه دمو، رمز عبور چک نمی‌شود)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
