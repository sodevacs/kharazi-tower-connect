

export type Tower = {
  id: string;
  name: string;
};

export type IssueType = {
  id: string;
  name: string;
  requiresDetails?: boolean;
};

export type Expert = {
  id: string;
  name: string;
  averageRating: number;
  totalRatings: number;
};

export type UserRole = 'resident' | 'manager' | 'admin';

export type User = {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  accessibleTowers?: string[];
};

export type IssueReport = {
  id: string;
  towerId: string;
  issueTypeId: string;
  details?: string;
  fullName: string;
  unitNumber: string;
  phoneNumber: string;
  status: 'pending' | 'inProgress' | 'resolved';
  createdAt: Date;
};

export type Rating = {
  id: string;
  expertId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
};

