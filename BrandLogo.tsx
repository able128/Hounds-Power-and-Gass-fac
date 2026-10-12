import React, { useState } from 'react';
import { Zap, Flame } from 'lucide-react';
import { COMPANY_NAME, TAGLINE } from '../data/mockData';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  theme?: 'dark' | 'light';
  variant?: 'full' | 'icon-only';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  theme = 'light',
  variant = 'full',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Logo Image or Fallback Vector Badge */}
      <div className="relative shrink-0 flex items-center justify-center">
        {!imgError ? (
          <img
            src="/logo.svg"
            alt={`${COMPANY_NAME} Logo`}
            className={`${sizeClasses[size]} w-auto object-contain rounded-lg drop-shadow-sm`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`${sizeClasses[size]} aspect-square rounded-xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 border border-slate-700/60 p-1.5 flex flex-col items-center justify-center text-white shadow-md relative overflow-hidden`}>
            {/* Ambient glows */}
            <div className="absolute -left-2 -top-2 w-8 h-8 bg-amber-500/30 rounded-full blur-md" />
            <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-cyan-500/30 rounded-full blur-md" />
            <div className="flex items-center justify-center gap-1 z-10">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Flame className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            </div>
            <span className="text-[9px] font-black tracking-tighter text-amber-400 mt-0.5">HPG</span>
          </div>
        )}
      </div>

      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-tight leading-none ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              } ${textClasses[size]}`}
            >
              HOUNDS
            </span>
            <span className="font-extrabold text-amber-500 text-xs sm:text-sm tracking-wide">
              POWER & GAS
            </span>
          </div>
          {showTagline && size !== 'sm' && (
            <span
              className={`text-[10px] tracking-widest uppercase font-semibold mt-0.5 ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {TAGLINE}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
