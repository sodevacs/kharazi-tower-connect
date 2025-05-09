
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, IssueReport, Rating, Tower, UserRole } from '../types';
import { MOCK_USERS, TOWERS, EXPERTS } from '../data/constants';
import { toast } from 'sonner';

type AppContextType = {
  // Authentication
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Issue Reports
  issueReports: IssueReport[];
  addIssueReport: (report: Omit<IssueReport, 'id' | 'status' | 'createdAt'>) => void;
  updateIssueStatus: (id: string, status: IssueReport['status']) => void;
  getFilteredReports: (towerIds?: string[]) => IssueReport[];
  
  // Ratings
  ratings: Rating[];
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  
  // Admin functions
  towers: Tower[];
  addTower: (name: string) => void;
  removeTower: (id: string) => void;
  
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  removeUser: (id: string) => void;

  // Login failures tracking
  loginAttempts: number;
  lockedUntil: Date | null;
};

// Mock data for initial state
const initialIssueReports: IssueReport[] = [
  {
    id: '1',
    towerId: '1',
    issueTypeId: '3',
    fullName: 'امیر محمدی',
    unitNumber: '303',
    phoneNumber: '09123456789',
    status: 'pending',
    createdAt: new Date('2023-05-01'),
    details: 'اینترنت قطع و وصل می‌شود'
  },
  {
    id: '2',
    towerId: '2',
    issueTypeId: '1',
    fullName: 'سارا احمدی',
    unitNumber: '504',
    phoneNumber: '09123456788',
    status: 'inProgress',
    createdAt: new Date('2023-05-02'),
    details: 'آیفون تصویری کار نمی‌کند'
  }
];

const initialRatings: Rating[] = [
  {
    id: '1',
    expertId: '1',
    rating: 5,
    comment: 'برخورد عالی، تعمیر سریع',
    createdAt: new Date('2023-05-01')
  },
  {
    id: '2',
    expertId: '2',
    rating: 4,
    createdAt: new Date('2023-05-02')
  },
  {
    id: '3',
    expertId: '3',
    rating: 5,
    comment: 'خیلی سریع مشکل را حل کردند',
    createdAt: new Date('2023-05-03')
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [issueReports, setIssueReports] = useState<IssueReport[]>(initialIssueReports);
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [towers, setTowers] = useState<Tower[]>(TOWERS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);

  // Load data from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const storedReports = localStorage.getItem('issueReports');
    if (storedReports) {
      setIssueReports(JSON.parse(storedReports).map((report: any) => ({
        ...report,
        createdAt: new Date(report.createdAt)
      })));
    }

    const storedRatings = localStorage.getItem('ratings');
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings).map((rating: any) => ({
        ...rating,
        createdAt: new Date(rating.createdAt)
      })));
    }

    const storedTowers = localStorage.getItem('towers');
    if (storedTowers) {
      setTowers(JSON.parse(storedTowers));
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const storedLockedUntil = localStorage.getItem('lockedUntil');
    if (storedLockedUntil) {
      setLockedUntil(new Date(storedLockedUntil));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('issueReports', JSON.stringify(issueReports));
  }, [issueReports]);

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('towers', JSON.stringify(towers));
  }, [towers]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (lockedUntil) {
      localStorage.setItem('lockedUntil', lockedUntil.toISOString());
    } else {
      localStorage.removeItem('lockedUntil');
    }
  }, [lockedUntil]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check if account is locked
    if (lockedUntil && new Date() < lockedUntil) {
      const timeLeft = Math.ceil((lockedUntil.getTime() - new Date().getTime()) / 1000);
      toast.error(`حساب کاربری قفل شده است. لطفاً ${timeLeft} ثانیه دیگر تلاش کنید.`);
      return false;
    }

    // For demo purposes, we're not checking passwords, just username
    const user = users.find((u) => u.username === username);
    
    if (user) {
      setCurrentUser(user);
      setLoginAttempts(0); // Reset attempts on success
      return true;
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Lock account after 3 failed attempts
      if (newAttempts >= 3) {
        const lockUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        setLockedUntil(lockUntil);
        setLoginAttempts(0); // Reset counter after locking
        toast.error('حساب کاربری به مدت 5 دقیقه قفل شد.');
      }
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addIssueReport = (report: Omit<IssueReport, 'id' | 'status' | 'createdAt'>) => {
    const newReport: IssueReport = {
      ...report,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date()
    };
    setIssueReports([...issueReports, newReport]);
    toast.success('گزارش شما با موفقیت ثبت شد');
  };

  const updateIssueStatus = (id: string, status: IssueReport['status']) => {
    setIssueReports(
      issueReports.map((report) =>
        report.id === id ? { ...report, status } : report
      )
    );
    toast.success('وضعیت گزارش به‌روزرسانی شد');
  };

  const getFilteredReports = (towerIds?: string[]) => {
    if (!towerIds || towerIds.length === 0) {
      return issueReports;
    }
    return issueReports.filter((report) => towerIds.includes(report.towerId));
  };

  const addRating = (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setRatings([...ratings, newRating]);
    toast.success('امتیاز شما با موفقیت ثبت شد');
  };

  const addTower = (name: string) => {
    const newTower: Tower = {
      id: Date.now().toString(),
      name
    };
    setTowers([...towers, newTower]);
    toast.success('برج جدید با موفقیت اضافه شد');
  };

  const removeTower = (id: string) => {
    setTowers(towers.filter((tower) => tower.id !== id));
    toast.success('برج با موفقیت حذف شد');
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    setUsers([...users, newUser]);
    toast.success('کاربر جدید با موفقیت اضافه شد');
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, ...userData } : user
      )
    );
    
    // Update currentUser if that's the user being updated
    if (currentUser && currentUser.id === id) {
      setCurrentUser({ ...currentUser, ...userData });
    }
    
    toast.success('اطلاعات کاربر با موفقیت به‌روزرسانی شد');
  };

  const removeUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    toast.success('کاربر با موفقیت حذف شد');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        issueReports,
        addIssueReport,
        updateIssueStatus,
        getFilteredReports,
        ratings,
        addRating,
        towers,
        addTower,
        removeTower,
        users,
        addUser,
        updateUser,
        removeUser,
        loginAttempts,
        lockedUntil
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
