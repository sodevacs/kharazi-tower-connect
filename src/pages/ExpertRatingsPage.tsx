
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { EXPERTS } from '../data/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ExpertRatingsPage: React.FC = () => {
  const { ratings } = useAppContext();
  
  // Calculate expert stats
  const expertStats = EXPERTS.map(expert => {
    const expertRatings = ratings.filter(r => r.expertId === expert.id);
    const totalRatings = expertRatings.length;
    
    if (totalRatings === 0) {
      return {
        ...expert,
        actualAverageRating: 0,
        ratingCounts: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        latestComments: []
      };
    }
    
    const sum = expertRatings.reduce((acc, r) => acc + r.rating, 0);
    const actualAverageRating = sum / totalRatings;
    
    // Count ratings by value
    const ratingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    expertRatings.forEach(r => {
      ratingCounts[r.rating as 1|2|3|4|5]++;
    });
    
    // Get latest 3 comments
    const latestComments = expertRatings
      .filter(r => r.comment)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);
      
    return {
      ...expert,
      actualAverageRating,
      ratingCounts,
      latestComments
    };
  });
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">امتیاز کارشناسان</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expertStats.map((expertStat) => (
          <Card key={expertStat.id} className="card-shadow">
            <CardHeader className="bg-primary-lighter">
              <CardTitle>{expertStat.name}</CardTitle>
              <div className="flex items-center justify-between">
                <CardDescription>
                  <span>میانگین امتیاز:</span>
                  <Badge variant="secondary" className="text-lg ms-2">
                    {expertStat.actualAverageRating.toFixed(1)} از 5
                  </Badge>
                </CardDescription>
                <Badge className="bg-primary">
                  {expertStat.totalRatings} رأی
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="w-6 text-sm">{rating}</div>
                    <Progress 
                      value={expertStat.ratingCounts[rating as 1|2|3|4|5] / (expertStat.totalRatings || 1) * 100} 
                      className="h-2.5" 
                    />
                    <div className="w-10 text-sm text-muted-foreground">
                      {expertStat.ratingCounts[rating as 1|2|3|4|5]}
                    </div>
                  </div>
                ))}
              </div>
              
              {expertStat.latestComments && expertStat.latestComments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">آخرین نظرات:</h4>
                  <div className="space-y-2">
                    {expertStat.latestComments.map((comment, index) => (
                      <div 
                        key={index} 
                        className="p-2 bg-gray-50 rounded-md text-sm"
                      >
                        {comment.comment}
                        <div className="text-xs text-muted-foreground mt-1">
                          امتیاز: {comment.rating} از 5
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpertRatingsPage;
