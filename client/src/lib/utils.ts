import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Current time in milliseconds
  const now = new Date().getTime();
  
  // Date to check in milliseconds
  const dateToCheck = d.getTime();
  
  // Calculate the difference in milliseconds
  const differenceMs = now - dateToCheck;
  
  // Convert to appropriate units
  const secondsDifference = Math.floor(differenceMs / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  
  // Return a human-readable string
  if (secondsDifference < 60) {
    return 'just now';
  } else if (minutesDifference < 60) {
    return `${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''} ago`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference} hour${hoursDifference !== 1 ? 's' : ''} ago`;
  } else if (daysDifference < 7) {
    return `${daysDifference} day${daysDifference !== 1 ? 's' : ''} ago`;
  } else {
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateStarRating(rating: number): { full: number; half: number; empty: number } {
  // Convert rating out of 100 to rating out of 5
  const ratingOutOfFive = rating / 20;
  
  // Calculate full stars (integer part of the rating)
  const fullStars = Math.floor(ratingOutOfFive);
  
  // Calculate if there should be a half star
  const hasHalfStar = ratingOutOfFive - fullStars >= 0.5 ? 1 : 0;
  
  // Calculate empty stars
  const emptyStars = 5 - fullStars - hasHalfStar;
  
  return {
    full: fullStars,
    half: hasHalfStar,
    empty: emptyStars
  };
}
