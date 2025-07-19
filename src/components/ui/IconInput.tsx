import React from "react";

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          className={`w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:ring-blue-500 ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

IconInput.displayName = "IconInput";
