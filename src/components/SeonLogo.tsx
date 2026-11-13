import React from 'react';

interface SeonLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function SeonLogo({ size = 34, showWordmark = true, className = '' }: SeonLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full border border-emerald-500/35 bg-card p-1 shadow-sm"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className="h-full w-full"
        >
          <circle cx="32" cy="32" r="29" fill="#0B1220" stroke="#10B981" strokeWidth="2.5" />
          <circle
            cx="32"
            cy="32"
            r="21.5"
            stroke="#38BDF8"
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M21 36C21 28.5 26 23 32 19C38 23 43 28.5 43 36C43 41.5 38.1 46 32 46C25.9 46 21 41.5 21 36Z"
            fill="url(#seonEmblemGrad)"
            fillOpacity="0.22"
            stroke="#10B981"
            strokeWidth="2.4"
          />
          <path
            d="M24 34.5C27 30.5 30 38.5 33 34C35.5 30.2 38 35.5 40 32.5"
            stroke="#38BDF8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="23.5" r="2.3" fill="#10B981" />
          <defs>
            <linearGradient
              id="seonEmblemGrad"
              x1="21"
              y1="19"
              x2="43"
              y2="46"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground whitespace-nowrap">
          SEON
        </span>
      )}
    </span>
  );
}
