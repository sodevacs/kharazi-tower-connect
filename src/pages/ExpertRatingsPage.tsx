
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ExpertRatingsPage = () => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('public_ratings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching ratings:', error);
          return;
        }
        
        setRatings(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRatings();
  }, []);
  
  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  return (
    <div className="space-y-8">
      <Card className="card-shadow">
        <CardHeader className="bg-primary-lighter">
          <CardTitle className="text-2xl text-center text-gray-800">
            نظرات کاربران
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            مشاهده نتایج نظرسنجی کاربران درباره برج‌های خرازی
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center text-gray-500">در حال بارگذاری نظرات...</p>
          ) : (
            <div>
              <div className="bg-gray-100 p-4 rounded-lg text-center mb-6">
                <p className="font-bold text-lg mb-2">میانگین امتیازات</p>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{getAverageRating()}</span>
                  <span className="text-yellow-500 text-3xl mx-2">★</span>
                  <span className="text-gray-600">از {ratings.length} نظر</span>
                </div>
              </div>
              
              {ratings.length > 0 ? (
                <div className="space-y-6">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{rating.name}</h3>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-yellow-500 text-lg">
                              {star <= rating.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                      </div>
                      {rating.comment && (
                        <p className="mt-2 text-gray-700">{rating.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(rating.created_at).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">هنوز نظری ثبت نشده است</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertRatingsPage;
