import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertGmtToLocal(dateString: string): string {
  // your logic here
}

export function formatTimerDigit(digit: number): string {
  // your logic here
}

export function formatRelativeDate(date: Date): string {
  // your logic here
}
