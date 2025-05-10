
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, ChevronDown } from 'lucide-react';

type NavItemProps = {
  to: string;
  children: React.ReactNode;
};

const NavItem: React.FC<NavItemProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        'px-4 py-2 rounded-md transition-colors font-bold',
        isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-700 hover:bg-primary-lighter'
      )}
    >
      {children}
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center w-full md:w-auto justify-between mb-4 md:mb-0">
            <div className="flex items-center">
              <img 
                src="/placeholder.svg" 
                alt="لوگو شرکت سهند ارتباطات خاورمیانه" 
                className="h-10 w-auto ml-3" 
              />
              <h1 className="text-xl md:text-2xl font-bold app-title">
                سامانه مدیریت برج‌های خرازی
              </h1>
            </div>
            
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu} 
                className="md:hidden"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            )}
          </div>
          
          <nav className={cn(
            "flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto",
            isMobile && !menuOpen ? "hidden" : "flex"
          )}>
            <NavItem to="/">صفحه اصلی</NavItem>
            <NavItem to="/report-issue">گزارش خرابی</NavItem>
            <NavItem to="/rate-experts">نظرسنجی</NavItem>
            <NavItem to="/expert-ratings">نتایج نظرات</NavItem>
            
            {user ? (
              <>
                <NavItem to="/admin">مدیریت</NavItem>
                <Button 
                  variant="ghost" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold"
                  onClick={() => logout()}
                >
                  خروج
                </Button>
              </>
            ) : (
              <NavItem to="/login">ورود</NavItem>
            )}
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        {children}
      </main>
      
      <footer className="bg-white border-t mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} - تمامی حقوق متعلق به شرکت سهند ارتباطات خاورمیانه می‌باشد
        </div>
      </footer>
    </div>
  );
};

export default Layout;
