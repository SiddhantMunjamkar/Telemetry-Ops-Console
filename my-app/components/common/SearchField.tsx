"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label": string;
  className?: string;
};

export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
  "aria-label": ariaLabel,
  className,
}: SearchFieldProps) {
  return (
    <div className={cn("relative max-w-md flex-1", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={ariaLabel}
      />
    </div>
  );
}
