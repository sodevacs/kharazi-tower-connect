
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email({ message: 'ایمیل نامعتبر است' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'نام باید حداقل ۲ کاراکتر باشد' }),
  email: z.string().email({ message: 'ایمیل نامعتبر است' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const AuthPage: React.FC = () => {
  const { login, signup, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
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
        navigate('/');
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
  
  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await signup(data.email, data.password, { name: data.name });
      
      if (result.success) {
        toast.success('ثبت‌نام موفقیت‌آمیز');
        setActiveTab('login');
        loginForm.setValue('email', data.email);
      } else {
        toast.error(result.error || 'خطا در ثبت‌نام');
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
            {activeTab === 'login' ? 'ورود به سیستم' : 'ثبت‌نام در سیستم'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {activeTab === 'login' 
              ? 'لطفا ایمیل و رمز عبور خود را وارد کنید' 
              : 'برای ایجاد حساب کاربری جدید، فرم زیر را تکمیل کنید'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">ورود</TabsTrigger>
              <TabsTrigger value="signup">ثبت‌نام</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
            </TabsContent>
            
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="نام خود را وارد کنید" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
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
                    control={signupForm.control}
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
                    {isSubmitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>برای تست برنامه می‌توانید از حساب‌های زیر استفاده کنید:</p>
            <ul className="mt-1">
              <li>ادمین: admin@example.com (رمز: 123456)</li>
              <li>مدیر: manager@example.com (رمز: 123456)</li>
            </ul>
            <p className="mt-2 text-xs">
              توجه: برای راحتی در تست، تأیید ایمیل غیرفعال شده است.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
