import { pgStorage } from '../pgStorage';
import { log } from '../vite';
import { InsertArticle } from '@shared/schema';

// Service for fetching and updating news
export class NewsUpdaterService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
    if (!this.apiKey) {
      log('WARNING: NEWS_API_KEY not set. Automatic news updates will not work.', 'newsUpdater');
    }
  }

  // Fetch gaming news from NewsAPI.org
  async fetchGamingNews(): Promise<any[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=gaming+OR+videogames+OR+playstation+OR+xbox+OR+nintendo&sortBy=publishedAt&apiKey=${this.apiKey}&pageSize=10&language=en`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }

      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      log(`Error fetching news: ${error}`, 'newsUpdater');
      return [];
    }
  }

  // Map external news data to our article schema
  private mapNewsToArticle(article: any): InsertArticle {
    const categories = ['pc', 'console', 'mobile', 'industry', 'esports'];
    // Choose a pseudo-random category based on content
    const categoryIndex = Math.floor(
      (article.title.length + article.description?.length || 0) % categories.length
    );

    return {
      title: article.title || 'Untitled Article',
      content: 
        `<p>${article.description || ''}</p>
         <p>${article.content?.replace(/\[\+\d+ chars\]$/, '') || ''}</p>
         <p>Source: <a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.source?.name || 'External source'}</a></p>`,
      summary: article.description || 'No description available',
      imageUrl: article.urlToImage || 'https://placehold.co/600x400?text=Gaming+News',
      category: categories[categoryIndex],
      publishedAt: new Date(article.publishedAt || new Date()),
      commentCount: 0,
      featured: false,
    };
  }

  // Update database with new articles
  async updateNews(): Promise<number> {
    try {
      const newsArticles = await this.fetchGamingNews();
      let addedCount = 0;

      for (const article of newsArticles) {
        try {
          // Check if we already have an article with similar title
          const similarArticles = await pgStorage.searchArticles(article.title.substring(0, 30));
          if (similarArticles.length === 0) {
            // Only add the article if we don't have one with a similar title
            const mappedArticle = this.mapNewsToArticle(article);
            await pgStorage.createArticle(mappedArticle);
            addedCount++;
          }
        } catch (error) {
          log(`Error adding article: ${error}`, 'newsUpdater');
        }
      }

      log(`Added ${addedCount} new articles from news feed`, 'newsUpdater');
      return addedCount;
    } catch (error) {
      log(`Error updating news: ${error}`, 'newsUpdater');
      return 0;
    }
  }

  // Set the newest article as featured
  async updateFeaturedArticle(): Promise<void> {
    try {
      // Get the newest article
      const articles = await pgStorage.getArticles(1);
      if (articles.length > 0) {
        await pgStorage.setFeaturedArticle(articles[0].id);
        log(`Set article "${articles[0].title}" as featured`, 'newsUpdater');
      }
    } catch (error) {
      log(`Error updating featured article: ${error}`, 'newsUpdater');
    }
  }
}

// Export singleton instance
export const newsUpdaterService = new NewsUpdaterService();