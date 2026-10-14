import React from 'react';
import { assetUrl } from '@/api/client';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-semibold'
  };

  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={assetUrl(src)}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-brand-500 text-white flex items-center justify-center font-medium shadow-sm ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
