
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../../context/AppContext';
import { TOWERS } from '../../data/constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'نام باید حداقل 2 کاراکتر باشد' }),
  username: z.string().min(3, { message: 'نام کاربری باید حداقل 3 کاراکتر باشد' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل 6 کاراکتر باشد' }),
  role: z.enum(['admin', 'manager']),
  accessibleTowers: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, removeUser, currentUser } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTowers, setSelectedTowers] = useState<string[]>([]);

  // Filter out the current user from the list (can't edit self here)
  const filteredUsers = users.filter(user => user.id !== currentUser?.id);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      role: 'manager',
      accessibleTowers: [],
    },
  });
  
  const watchRole = form.watch('role');
  
  const onSubmit = async (data: FormData) => {
    try {
      // Create user data
      const userData = {
        name: data.name,
        username: data.username,
        role: data.role,
        accessibleTowers: data.role === 'admin' ? undefined : selectedTowers,
      };
      
      addUser(userData);
      form.reset();
      setSelectedTowers([]);
      setIsAddDialogOpen(false);
      toast.success('کاربر جدید با موفقیت اضافه شد');
    } catch (error) {
      toast.error('خطا در افزودن کاربر');
      console.error(error);
    }
  };
  
  const handleTowerToggle = (towerId: string) => {
    setSelectedTowers(prev => 
      prev.includes(towerId)
        ? prev.filter(id => id !== towerId)
        : [...prev, towerId]
    );
  };
  
  const handleDeleteUser = (userId: string) => {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      removeUser(userId);
    }
  };
  
  const getTowersString = (towerIds?: string[]) => {
    if (!towerIds || towerIds.length === 0) return 'دسترسی به همه برج‌ها';
    
    return towerIds
      .map(id => TOWERS.find(t => t.id === id)?.name || '')
      .filter(Boolean)
      .join('، ');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>مدیریت کاربران</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>افزودن کاربر جدید</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>افزودن کاربر جدید</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نام</FormLabel>
                      <FormControl>
                        <Input placeholder="نام کاربر را وارد کنید" {...field} />
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
                        <Input placeholder="نام کاربری را وارد کنید" {...field} />
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
                          placeholder="رمز عبور را وارد کنید" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نقش کاربر</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="نقش کاربر را انتخاب کنید" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">مدیر کل سیستم</SelectItem>
                          <SelectItem value="manager">مدیر ساختمان (محدود)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchRole === 'manager' && (
                  <div>
                    <FormLabel>دسترسی به برج‌ها</FormLabel>
                    <div className="border rounded-md p-3 space-y-2 mt-2">
                      {TOWERS.map((tower) => (
                        <div key={tower.id} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`tower-${tower.id}`}
                            checked={selectedTowers.includes(tower.id)}
                            onCheckedChange={() => handleTowerToggle(tower.id)}
                          />
                          <label
                            htmlFor={`tower-${tower.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2"
                          >
                            {tower.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedTowers.length === 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        حداقل یک برج را انتخاب کنید
                      </p>
                    )}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={watchRole === 'manager' && selectedTowers.length === 0}
                >
                  افزودن کاربر
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center p-8 border rounded-md">
            کاربری یافت نشد
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام</TableHead>
                  <TableHead>نام کاربری</TableHead>
                  <TableHead>نقش</TableHead>
                  <TableHead>دسترسی به برج‌ها</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? (
                        <Badge className="bg-purple-600">مدیر کل سیستم</Badge>
                      ) : (
                        <Badge className="bg-blue-600">مدیر ساختمان</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getTowersString(user.accessibleTowers)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        حذف
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
