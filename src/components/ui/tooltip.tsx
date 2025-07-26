"use client";

import React, { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // 화면 위쪽 공간이 부족하면 아래쪽에 표시
      if (rect.top < tooltipRect.height + 10) {
        setTooltipPosition('bottom');
      } else {
        setTooltipPosition('top');
      }
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md shadow-lg max-w-xs left-1/2 transform -translate-x-1/2 ${
            tooltipPosition === 'top' 
              ? '-top-1 -translate-y-full' 
              : 'top-full mt-1'
          }`}
        >
          <div className="break-words leading-relaxed">
            {content}
          </div>
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-transparent ${
            tooltipPosition === 'top'
              ? 'top-full border-t-3 border-t-gray-900'
              : 'bottom-full border-b-3 border-b-gray-900'
          }`}></div>
        </div>
      )}
    </div>
  );
};
