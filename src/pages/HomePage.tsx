
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 app-title">
          سامانه مدیریت خرابی برج‌های خرازی
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          به سامانه گزارش و پیگیری مشکلات زیرساختی برج‌های خرازی خوش آمدید.
          این سامانه توسط شرکت سهند ارتباطات خاورمیانه ارائه شده است.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="card-shadow hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-16 w-16 bg-primary-lighter rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">گزارش خرابی</h2>
            <p className="text-gray-600 mb-6">
              مشکلات زیرساختی مانند اینترنت، آیفون و تلفن را گزارش دهید.
            </p>
            <Button asChild>
              <Link to="/report-issue">گزارش مشکل</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-shadow hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-16 w-16 bg-primary-lighter rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">امتیازدهی به کارشناسان</h2>
            <p className="text-gray-600 mb-6">
              به کارشناسان امتیاز دهید و تجربه خود را با دیگران به اشتراک بگذارید.
            </p>
            <Button asChild>
              <Link to="/rate-experts">امتیازدهی</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-shadow hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-16 w-16 bg-primary-lighter rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">مشاهده امتیازها</h2>
            <p className="text-gray-600 mb-6">
              امتیاز و نظرات کارشناسان را مشاهده کنید.
            </p>
            <Button asChild>
              <Link to="/expert-ratings">مشاهده امتیازها</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 p-6 bg-primary-lighter rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">درباره ما</h2>
        <p className="text-center max-w-3xl mx-auto">
          شرکت سهند ارتباطات خاورمیانه ارائه‌دهنده خدمات ارتباطی و زیرساختی در برج‌های خرازی است.
          هدف ما فراهم کردن بهترین خدمات و پشتیبانی برای ساکنین محترم برج‌های خرازی می‌باشد.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
