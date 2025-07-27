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
  const [tooltipPosition, setTooltipPosition] = useState<"top" | "bottom">("top");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      if (rect.top < tooltipRect.height + 10) {
        setTooltipPosition("bottom");
      } else {
        setTooltipPosition("top");
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
          className={`
            absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-md shadow-lg
            left-1/2 transform -translate-x-1/2
            min-w-[20vw] max-w-[40vw]
            whitespace-normal break-words
            ${tooltipPosition === "top" ? "-top-1 -translate-y-full" : "top-full mt-1"}
          `}
        >
          <div className="leading-relaxed">
            {content}
          </div>

          {/* 꼬리 화살표 */}
          <div
            className={`
              absolute left-1/2 transform -translate-x-1/2 w-0 h-0 
              border-x-8 border-transparent
              ${tooltipPosition === "top"
                ? "top-full border-t-[6px] border-t-gray-900"
                : "bottom-full border-b-[6px] border-b-gray-900"}
            `}
          ></div>
        </div>
      )}
    </div>
  );
};
