
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../../context/AppContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, { message: 'نام برج الزامی است' }),
});

type FormData = z.infer<typeof formSchema>;

const TowerManagement: React.FC = () => {
  const { towers, addTower, removeTower } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      addTower(data.name);
      form.reset();
      setIsAddDialogOpen(false);
      toast.success('برج جدید با موفقیت اضافه شد');
    } catch (error) {
      toast.error('خطا در افزودن برج');
      console.error(error);
    }
  };
  
  const handleDeleteTower = (towerId: string) => {
    if (confirm('آیا از حذف این برج اطمینان دارید؟')) {
      removeTower(towerId);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>مدیریت برج‌ها</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>افزودن برج جدید</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>افزودن برج جدید</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نام برج</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: B11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  افزودن برج
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {towers.length === 0 ? (
          <div className="text-center p-8 border rounded-md">
            برجی یافت نشد
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شناسه</TableHead>
                  <TableHead>نام برج</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {towers.map((tower) => (
                  <TableRow key={tower.id}>
                    <TableCell>{tower.id}</TableCell>
                    <TableCell>{tower.name}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteTower(tower.id)}
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

export default TowerManagement;
