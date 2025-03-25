import { Article, Review, Subscription } from "@shared/schema";

export type Category = {
  id: string;
  name: string;
};

export type SearchResult = {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  publishedAt: Date;
  type: 'article' | 'review';
};

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Categories' },
  { id: 'pc', name: 'PC Gaming' },
  { id: 'console', name: 'Console' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'esports', name: 'Esports' },
  { id: 'industry', name: 'Industry' }
];
