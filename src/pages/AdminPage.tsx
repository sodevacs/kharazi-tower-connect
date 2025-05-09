
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IssueManagement from '../components/admin/IssueManagement';
import UserManagement from '../components/admin/UserManagement';
import TowerManagement from '../components/admin/TowerManagement';
import AccountSettings from '../components/admin/AccountSettings';

const AdminPage: React.FC = () => {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('issues');
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  const isAdmin = currentUser.role === 'admin';
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">پنل مدیریت</h1>
      
      <Tabs 
        defaultValue="issues" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="issues">مدیریت گزارش‌ها</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="users">مدیریت کاربران</TabsTrigger>
              <TabsTrigger value="towers">مدیریت برج‌ها</TabsTrigger>
            </>
          )}
          <TabsTrigger value="account">تنظیمات حساب</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues">
          <IssueManagement />
        </TabsContent>
        
        {isAdmin && (
          <>
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="towers">
              <TowerManagement />
            </TabsContent>
          </>
        )}
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
