import { 
  users, type User, type InsertUser,
  articles, type Article, type InsertArticle,
  reviews, type Review, type InsertReview,
  subscriptions, type Subscription, type InsertSubscription
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Article operations
  getArticles(limit?: number, category?: string): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getFeaturedArticle(): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  searchArticles(query: string): Promise<Article[]>;
  setFeaturedArticle(articleId: number): Promise<void>;

  // Review operations
  getReviews(limit?: number, category?: string): Promise<Review[]>;
  getReviewById(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;

  // Subscription operations
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByEmail(email: string): Promise<Subscription | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private reviews: Map<number, Review>;
  private subscriptions: Map<number, Subscription>;
  
  private nextUserId: number;
  private nextArticleId: number;
  private nextReviewId: number;
  private nextSubscriptionId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.reviews = new Map();
    this.subscriptions = new Map();
    
    this.nextUserId = 1;
    this.nextArticleId = 1;
    this.nextReviewId = 1;
    this.nextSubscriptionId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample articles
    const sampleArticles: InsertArticle[] = [
      {
        title: "GTA VI Reveal Trailer Breaks All-Time Viewing Records",
        content: "<p>Rockstar's long-awaited GTA VI trailer has shattered records with over 100 million views in just 24 hours, becoming the most-watched video game trailer in history.</p><p>The trailer, which offers the first official glimpse of the game's setting in Vice City, has generated unprecedented excitement across social media platforms and gaming communities worldwide.</p><p>Industry analysts suggest this level of engagement could translate to record-breaking sales when the game launches in 2025, potentially making it the biggest entertainment release of all time.</p>",
        summary: "Rockstar's long-awaited GTA VI trailer has shattered records with over 100 million views in just 24 hours.",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80",
        category: "FEATURED STORY",
        publishedAt: new Date("2023-12-05"),
        commentCount: 358,
        featured: true
      },
      {
        title: "Nvidia Announces RTX 5090 With Revolutionary AI Capabilities",
        content: "<p>Nvidia has unveiled its next-generation flagship graphics card, the RTX 5090, promising 4x performance improvements over the previous generation and advanced AI processing capabilities.</p><p>The new GPU features 32GB of GDDR7 memory and is built on a 3nm process, allowing for significant performance gains while reducing power consumption compared to the 4090.</p><p>Analysts expect the card to retail for $1,599 when it launches next month, with limited availability expected due to high demand.</p>",
        summary: "The next generation of graphics cards promises 4x performance improvement and advanced AI processing.",
        imageUrl: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=340&q=80",
        category: "PC GAMING",
        publishedAt: new Date(),
        commentCount: 24,
        featured: false
      },
      {
        title: "PlayStation 5 Pro Specs Leaked: 8K Gaming Is Finally Here",
        content: "<p>Insider documents reveal the PS5 Pro will support native 8K gaming at 30fps and feature enhanced ray tracing capabilities far beyond the current PS5 model.</p><p>The new console is expected to include a custom RDNA 3.5 GPU, 16GB of GDDR6 memory, and an enhanced version of AMD's Zen 4 CPU architecture.</p><p>Sony has not officially confirmed the device, but sources suggest a holiday 2024 release date with a price point of $599.</p>",
        summary: "Insider documents reveal the PS5 Pro will support native 8K gaming and feature enhanced ray tracing.",
        imageUrl: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=340&q=80",
        category: "CONSOLE",
        publishedAt: new Date(),
        commentCount: 87,
        featured: false
      },
      {
        title: "Team Liquid Secures $50M Investment, Expands to Asia",
        content: "<p>Esports organization Team Liquid has secured a $50 million investment to expand operations across Asian markets, including Japan, South Korea, and Singapore.</p><p>The funding will go toward building new training facilities, recruiting regional talent, and establishing competitive teams in popular Asian esports titles.</p><p>This expansion represents one of the largest Western investments in the Asian esports market to date.</p>",
        summary: "The esports giant plans to develop new training facilities and recruit talent across Asian markets.",
        imageUrl: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=340&q=80",
        category: "ESPORTS",
        publishedAt: new Date(),
        commentCount: 33,
        featured: false
      },
      {
        title: "Microsoft Acquires Valve Corporation in Surprise Deal",
        content: "<p>In a shocking development, Microsoft has announced the acquisition of Valve Corporation for $8.5 billion, bringing the Steam platform and Half-Life franchise under the Xbox umbrella.</p><p>Microsoft has stated that Steam will continue to operate as an independent storefront, but will receive deeper integration with Xbox Game Pass services.</p><p>The acquisition is still subject to regulatory approval, with both EU and US authorities expected to review the deal closely.</p>",
        summary: "The $8.5 billion acquisition brings Steam and Half-Life into the Xbox ecosystem, reshaping the industry.",
        imageUrl: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=340&q=80",
        category: "INDUSTRY",
        publishedAt: new Date(Date.now() - 86400000),
        commentCount: 125,
        featured: false
      },
      {
        title: "PUBG Mobile Surpasses $10 Billion in Lifetime Revenue",
        content: "<p>PUBG Mobile has officially surpassed $10 billion in lifetime revenue, cementing its position as one of the most financially successful mobile games of all time.</p><p>The battle royale title continues to maintain a strong player base five years after its release, particularly in Asian markets where it dominates the mobile esports scene.</p><p>Krafton has announced a major update coming next month that will introduce a new map and gameplay mechanics to celebrate this milestone.</p>",
        summary: "The battle royale juggernaut continues to dominate mobile gaming five years after its initial release.",
        imageUrl: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=340&q=80",
        category: "MOBILE",
        publishedAt: new Date(Date.now() - 86400000),
        commentCount: 52,
        featured: false
      }
    ];

    // Sample reviews
    const sampleReviews: InsertReview[] = [
      {
        title: "Elden Ring: Shadow of the Erdtree",
        content: "<p>FromSoftware's massive expansion delivers everything fans could hope for and more, building upon the already incredible foundation of the base game.</p><p>The new areas are hauntingly beautiful, with level design that continues to showcase why FromSoftware is the master of interconnected worlds. The addition of new weapons, including the transforming Trick Weapons inspired by Bloodborne, gives players more combat options than ever before.</p><p>While the difficulty remains high, the expansion feels fair throughout, with boss fights that rank among the studio's best work to date.</p>",
        summary: "FromSoftware's massive expansion delivers everything fans could hope for and more.",
        imageUrl: "https://images.unsplash.com/photo-1518908336710-4e1cf821d3d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=230&q=80",
        category: "ACTION RPG",
        rating: 95,
        publishedAt: new Date("2023-12-03"),
        author: "Alex Chen"
      },
      {
        title: "Metal Gear Solid Δ",
        content: "<p>Konami's remake of the original Metal Gear Solid is a masterclass in how to modernize a classic without losing its essence. The updated controls and graphics breathe new life into Shadow Moses, while the core stealth gameplay remains as tense and satisfying as ever.</p><p>The voice acting, featuring new performances from the original cast, adds emotional depth to an already compelling narrative about nuclear deterrence and genetic destiny.</p><p>A few pacing issues in the second half prevent it from achieving absolute perfection, but this is nonetheless an essential experience for both newcomers and veterans alike.</p>",
        summary: "Konami's remake brings Snake's classic mission to modern hardware with stunning results.",
        imageUrl: "https://images.unsplash.com/photo-1605979257913-1704eb7b6246?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=230&q=80",
        category: "STEALTH ACTION",
        rating: 87,
        publishedAt: new Date("2023-12-04"),
        author: "Sarah Johnson"
      },
      {
        title: "Forza Horizon 6",
        content: "<p>Playground Games delivers another gorgeous, content-rich racing experience with Forza Horizon 6, though the formula is beginning to show signs of age after multiple iterations.</p><p>The new Japanese setting is a visual treat, with diverse environments ranging from neon-lit cities to serene mountain passes. The car handling remains accessible yet nuanced, allowing for both casual fun and more serious racing.</p><p>However, many of the core gameplay loops and progression systems feel nearly identical to previous entries, creating a sense of déjà vu for longtime fans of the series.</p>",
        summary: "Beautiful but familiar, the latest Forza delivers polished racing but few innovations.",
        imageUrl: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=230&q=80",
        category: "RACING",
        rating: 78,
        publishedAt: new Date("2023-11-28"),
        author: "Marcus Taylor"
      },
      {
        title: "Hades II",
        content: "<p>Supergiant Games has achieved the nearly impossible task of creating a sequel that surpasses its predecessor in almost every way. Hades II builds upon the original's foundation with deeper combat systems, more varied environments, and an even more engaging narrative.</p><p>The new protagonist, Melinoë, brings a fresh perspective to the world of Greek mythology, with her own distinct abilities and relationships with the gods. The expanded cast of Olympians and chthonic entities provides more build variety and story possibilities than ever before.</p><p>With its perfect blend of roguelite action and narrative progression, Hades II sets a new standard for the genre.</p>",
        summary: "Supergiant's sequel surpasses the original with deeper systems and more varied gameplay.",
        imageUrl: "https://images.unsplash.com/photo-1594044198814-ad7516dfeac7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=230&q=80",
        category: "ROGUELITE",
        rating: 90,
        publishedAt: new Date("2023-11-25"),
        author: "Emma Rodriguez"
      }
    ];

    // Add sample data to storage
    sampleArticles.forEach(article => this.createArticle(article));
    sampleReviews.forEach(review => this.createReview(review));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Article operations
  async getArticles(limit?: number, category?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    // Filter by category if specified
    if (category && category !== 'all') {
      articles = articles.filter(article => article.category.toLowerCase() === category.toLowerCase());
    }
    
    // Sort by publishedAt descending (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Limit results if specified
    if (limit) {
      articles = articles.slice(0, limit);
    }
    
    return articles;
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getFeaturedArticle(): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.featured);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.nextArticleId++;
    const article: Article = { 
      ...insertArticle, 
      id,
      publishedAt: insertArticle.publishedAt || new Date(),
      commentCount: insertArticle.commentCount ?? 0,
      featured: insertArticle.featured ?? false
    };
    this.articles.set(id, article);
    return article;
  }

  async searchArticles(query: string): Promise<Article[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => 
        article.title.toLowerCase().includes(lowercaseQuery) || 
        article.summary.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  
  async setFeaturedArticle(articleId: number): Promise<void> {
    // First, unset any currently featured article
    const allArticles = Array.from(this.articles.values());
    for (const article of allArticles) {
      if (article.featured) {
        article.featured = false;
      }
    }
    
    // Then, set the target article as featured
    const article = this.articles.get(articleId);
    if (article) {
      article.featured = true;
    }
  }

  // Review operations
  async getReviews(limit?: number, category?: string): Promise<Review[]> {
    let reviews = Array.from(this.reviews.values());
    
    // Filter by category if specified
    if (category && category !== 'all') {
      reviews = reviews.filter(review => review.category.toLowerCase() === category.toLowerCase());
    }
    
    // Sort by publishedAt descending (newest first)
    reviews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Limit results if specified
    if (limit) {
      reviews = reviews.slice(0, limit);
    }
    
    return reviews;
  }

  async getReviewById(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.nextReviewId++;
    const review: Review = { 
      ...insertReview, 
      id,
      publishedAt: insertReview.publishedAt || new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  // Subscription operations
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    // Check if email already exists
    const existingSubscription = await this.getSubscriptionByEmail(insertSubscription.email);
    if (existingSubscription) {
      return existingSubscription;
    }
    
    const id = this.nextSubscriptionId++;
    const subscription: Subscription = { 
      ...insertSubscription, 
      id,
      subscribedAt: new Date(),
      acceptedPolicy: insertSubscription.acceptedPolicy ?? true
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (subscription) => subscription.email === email
    );
  }
}

export const storage = new MemStorage();
