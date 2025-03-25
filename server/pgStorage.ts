import { eq, desc, like, and, or } from 'drizzle-orm';
import { db } from './db';
import {
  articles,
  reviews,
  users,
  subscriptions,
  Article,
  Review,
  User,
  Subscription,
  InsertArticle,
  InsertReview,
  InsertUser,
  InsertSubscription
} from '@shared/schema';
import { IStorage } from './storage';

export class PgStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Article operations
  async getArticles(limit?: number, category?: string): Promise<Article[]> {
    let query = db.select().from(articles).orderBy(desc(articles.publishedAt));
    
    if (category && category !== 'all') {
      query = query.where(eq(articles.category, category));
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async getFeaturedArticle(): Promise<Article | undefined> {
    const result = await db.select().from(articles)
      .where(eq(articles.featured, true))
      .orderBy(desc(articles.publishedAt))
      .limit(1);
    return result[0];
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article).returning();
    return result[0];
  }

  async searchArticles(query: string): Promise<Article[]> {
    const searchPattern = `%${query}%`;
    const result = await db.select().from(articles)
      .where(
        or(
          like(articles.title, searchPattern),
          like(articles.summary, searchPattern),
          like(articles.content, searchPattern)
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(10);
    return result;
  }
  
  async setFeaturedArticle(articleId: number): Promise<void> {
    // First, unset any currently featured article
    await db.update(articles).set({ featured: false }).where(eq(articles.featured, true));
    
    // Then set the specified article as featured
    await db.update(articles).set({ featured: true }).where(eq(articles.id, articleId));
  }

  // Review operations
  async getReviews(limit?: number, category?: string): Promise<Review[]> {
    let query = db.select().from(reviews).orderBy(desc(reviews.publishedAt));
    
    if (category && category !== 'all') {
      query = query.where(eq(reviews.category, category));
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getReviewById(id: number): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
    return result[0];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  // Subscription operations
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptions).values(subscription).returning();
    return result[0];
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.email, email)).limit(1);
    return result[0];
  }
}

// Export singleton instance
export const pgStorage = new PgStorage();