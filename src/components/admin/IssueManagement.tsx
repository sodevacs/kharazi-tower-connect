
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { TOWERS, ISSUE_TYPES } from '../../data/constants';
import { IssueReport } from '../../types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const IssueManagement: React.FC = () => {
  const { currentUser, getFilteredReports, updateIssueStatus } = useAppContext();
  const [filterTowerId, setFilterTowerId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Get accessible towers based on user role
  const accessibleTowers = currentUser?.role === 'admin'
    ? TOWERS
    : TOWERS.filter(tower => 
        currentUser?.accessibleTowers?.includes(tower.id)
      );
  
  // Get filtered reports
  const towerIds = filterTowerId === 'all' 
    ? currentUser?.role === 'admin' 
      ? undefined 
      : currentUser?.accessibleTowers
    : [filterTowerId];
  
  const reports = getFilteredReports(towerIds);
  
  // Apply status filter
  const filteredReports = filterStatus === 'all'
    ? reports
    : reports.filter(report => report.status === filterStatus);
  
  // Sort by date (newest first)
  const sortedReports = [...filteredReports].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
  
  const getTowerName = (id: string) => {
    return TOWERS.find(tower => tower.id === id)?.name || 'نامشخص';
  };
  
  const getIssueTypeName = (id: string) => {
    return ISSUE_TYPES.find(type => type.id === id)?.name || 'نامشخص';
  };
  
  const getStatusBadge = (status: IssueReport['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">در انتظار بررسی</Badge>;
      case 'inProgress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">در حال بررسی</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">حل شده</Badge>;
      default:
        return <Badge>نامشخص</Badge>;
    }
  };
  
  const handleStatusChange = (reportId: string, newStatus: IssueReport['status']) => {
    updateIssueStatus(reportId, newStatus);
  };
  
  const handleSendToCRM = (report: IssueReport) => {
    // This would normally integrate with a CRM system
    // For demo, we'll just show a toast
    toast.success('گزارش به CRM ارسال شد');
    console.log('Sending to CRM:', report);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>مدیریت گزارش‌های خرابی</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">فیلتر براساس برج</label>
            <Select
              value={filterTowerId}
              onValueChange={setFilterTowerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="همه برج‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه برج‌ها</SelectItem>
                {accessibleTowers.map((tower) => (
                  <SelectItem key={tower.id} value={tower.id}>
                    {tower.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">فیلتر براساس وضعیت</label>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="همه وضعیت‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="pending">در انتظار بررسی</SelectItem>
                <SelectItem value="inProgress">در حال بررسی</SelectItem>
                <SelectItem value="resolved">حل شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {sortedReports.length === 0 ? (
          <div className="text-center p-8 border rounded-md">
            گزارشی یافت نشد
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>برج</TableHead>
                  <TableHead>نوع مشکل</TableHead>
                  <TableHead>واحد</TableHead>
                  <TableHead>گزارش دهنده</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{getTowerName(report.towerId)}</TableCell>
                    <TableCell>{getIssueTypeName(report.issueTypeId)}</TableCell>
                    <TableCell>{report.unitNumber}</TableCell>
                    <TableCell>
                      <div>{report.fullName}</div>
                      <div className="text-xs text-muted-foreground">{report.phoneNumber}</div>
                    </TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat('fa-IR').format(report.createdAt)}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={report.status}
                          onValueChange={(value) => handleStatusChange(
                            report.id, 
                            value as IssueReport['status']
                          )}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="تغییر وضعیت" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">در انتظار بررسی</SelectItem>
                            <SelectItem value="inProgress">در حال بررسی</SelectItem>
                            <SelectItem value="resolved">حل شده</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendToCRM(report)}
                        >
                          ارسال به CRM
                        </Button>
                      </div>
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

export default IssueManagement;
