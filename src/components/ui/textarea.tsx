'use client'

import React, { useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTextStateWithCatches , CharacterCountDisplay , LimitWarning } from "@/lib/helpers/useCharacterCount"


export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    wordLimit?: number;
    updateContentbyLorem?: (newContent: string) => void;
    children?: React.ReactNode;
}
  
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        className,
        value = "",
        onChange,
        wordLimit = 500,
        children,
        ...props
      }, ref ) => {
        
      const { state, setState, count, warning } = useTextStateWithCatches(value, wordLimit);
  
      // Sync external value prop with local state
      useEffect(() => {
        setState(value);
      }, [value]);
  
      // Handle input change
      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= wordLimit ) {
          setState(newValue);
          onChange && onChange(e); // Call the original onChange handler if provided
        }
      };
  
      return (
        <>
          <textarea
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            value={state}
            onChange={ handleChange }
            {...props}
          />
          <CharacterCountDisplay count={count} wordLimit={wordLimit} />
          <LimitWarning warning={warning.limitReached} />
          <div className="flex justify-end">
            {children}
  
          </div>
        </>
      );
    }
);

Textarea.displayName = "Textarea";
  
export { Textarea };

