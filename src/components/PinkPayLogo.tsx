"use client";

import { cn } from "~/lib/utils";

interface PinkPayLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function PinkPayLogo({ className, size = "md" }: PinkPayLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background circle with pink gradient */}
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="url(#pinkGradient)"
            stroke="url(#borderGradient)"
            strokeWidth="2"
          />
          
          {/* Letter P shape */}
          <path
            d="M16 14v20M16 14h8c3.314 0 6 2.686 6 6s-2.686 6-6 6h-8M16 20h8c1.657 0 3 1.343 3 3s-1.343 3-3 3h-8"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Payment icon elements */}
          <circle cx="32" cy="32" r="2.5" fill="white" opacity="0.8" />
          <circle cx="36" cy="28" r="1.5" fill="white" opacity="0.6" />
          <circle cx="28" cy="36" r="1.5" fill="white" opacity="0.6" />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {size !== "sm" && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold text-primary leading-tight",
            size === "xl" ? "text-2xl" : size === "lg" ? "text-xl" : "text-lg"
          )}>
            Pink Pay
          </span>
          {size === "xl" && (
            <span className="text-xs text-primary/70 font-medium">
              Crypto to Fiat
            </span>
          )}
        </div>
      )}
    </div>
  );
}