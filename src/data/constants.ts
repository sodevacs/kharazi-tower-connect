
import { Tower, IssueType, Expert, User } from '../types';

export const TOWERS: Tower[] = [
  { id: '1', name: 'B1' },
  { id: '2', name: 'B2' },
  { id: '3', name: 'B8' },
  { id: '4', name: 'B9' },
  { id: '5', name: 'B10' },
];

export const ISSUE_TYPES: IssueType[] = [
  { id: '1', name: 'آیفون' },
  { id: '2', name: 'تلفن' },
  { id: '3', name: 'اینترنت' },
  { id: '4', name: 'چراغ چشمک‌زن LOS' },
  { id: '5', name: 'چراغ چشمک‌زن PON' },
  { id: '6', name: 'سایر', requiresDetails: true },
];

export const EXPERTS: Expert[] = [
  { id: '1', name: 'سهیل ثبوت', averageRating: 4.5, totalRatings: 12 },
  { id: '2', name: 'علی‌اصغر ناصری', averageRating: 4.2, totalRatings: 8 },
  { id: '3', name: 'مهدی جزوانی', averageRating: 4.7, totalRatings: 15 },
];

// Mock users for demo
export const MOCK_USERS: User[] = [
  { id: '1', name: 'مدیر کل', username: 'admin', role: 'admin' },
  { 
    id: '2', 
    name: 'مدیر برج B1', 
    username: 'manager1', 
    role: 'manager', 
    accessibleTowers: ['1'] 
  },
  { 
    id: '3', 
    name: 'مدیر برج های B2 و B8', 
    username: 'manager2', 
    role: 'manager', 
    accessibleTowers: ['2', '3'] 
  },
];
