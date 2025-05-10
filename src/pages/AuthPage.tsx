
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email({ message: 'ایمیل نامعتبر است' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AuthPage: React.FC = () => {
  const { login, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);
  
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast.success('ورود موفقیت‌آمیز');
        navigate('/admin');
      } else {
        toast.error(result.error || 'خطا در ورود به سیستم');
      }
    } catch (error) {
      toast.error('خطا در برقراری ارتباط با سرور');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <Card className="card-shadow">
        <CardHeader className="bg-primary-lighter text-center">
          <CardTitle className="text-2xl text-gray-800">
            ورود به سیستم
          </CardTitle>
          <CardDescription className="text-gray-600">
            لطفا ایمیل و رمز عبور خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="ایمیل خود را وارد کنید" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'در حال ورود...' : 'ورود به سیستم'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>برای تست برنامه می‌توانید از حساب‌های زیر استفاده کنید:</p>
            <ul className="mt-1">
              <li>ادمین: admin@example.com (رمز: 123456)</li>
              <li>مدیر: manager@example.com (رمز: 123456)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
