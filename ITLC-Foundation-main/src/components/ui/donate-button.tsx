'use client';

import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useDonationModal } from '@/context/donation-modal-context';
import { cn } from '@/lib/utils';

interface DonateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  amount?: number;
  label?: string;
  showArrow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function DonateButton({
  amount,
  label = 'Donate Now',
  showArrow = false,
  size = 'md',
  className,
  onClick,
  ...props
}: DonateButtonProps) {
  const { openDonationModal } = useDonationModal();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else {
      openDonationModal(amount);
    }
  };

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2 text-xs md:text-sm gap-1.5',
    lg: 'px-7 py-3.5 text-sm sm:text-base gap-2',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'bg-[#168039] hover:bg-[#137233] text-white rounded-full font-medium flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <Heart className="w-4 h-4 fill-white text-white shrink-0" />
      <span>{label}</span>
      {showArrow && <ArrowRight className="w-4 h-4 ml-0.5" />}
    </button>
  );
}
