"use client";

import type { LucideIcon } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type FilterMenuProps<T extends string> = {
  label: string;
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  icon?: LucideIcon;
  activeSuffix?: string;
  menuLabel?: string;
  className?: string;
  contentClassName?: string;
};

export function FilterMenu<T extends string>({
  label,
  value,
  options,
  onChange,
  icon: Icon = SlidersHorizontal,
  activeSuffix,
  menuLabel,
  className,
  contentClassName,
}: FilterMenuProps<T>) {
  const selected = options.find((option) => option.value === value);
  const displaySuffix =
    activeSuffix ?? (selected && selected.value !== options[0]?.value
      ? `: ${selected.label}`
      : "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Icon className="size-4" aria-hidden />
          {label}
          {displaySuffix}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("w-48", contentClassName)}>
        <DropdownMenuLabel>{menuLabel ?? `Filter by ${label.toLowerCase()}`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as T)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
