
import React from 'react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Rating: React.FC<RatingProps> = ({ 
  value = 0, 
  onChange, 
  size = 'md' 
}) => {
  const stars = [1, 2, 3, 4, 5];
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'text-xl';
      case 'md': return 'text-2xl';
      case 'lg': return 'text-3xl';
      default: return 'text-2xl';
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={cn(
            'focus:outline-none',
            getSizeClass()
          )}
        >
          <span className={cn(
            'transition-colors',
            star <= value ? 'text-yellow-500' : 'text-gray-300'
          )}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};
