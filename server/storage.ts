import {
  users,
  wordpressPosts,
  socialPosts,
  leads,
  tasks,
  activities,
  seoKeywords,
  reviews,
  analyticsReports,
  type User,
  type InsertUser,
  type WordPressPost,
  type InsertWordPressPost,
  type SocialPost,
  type InsertSocialPost,
  type Lead,
  type InsertLead,
  type Task,
  type InsertTask,
  type Activity,
  type InsertActivity,
  type SeoKeyword,
  type InsertSeoKeyword,
  type Review,
  type InsertReview,
  type AnalyticsReport,
  type InsertAnalyticsReport,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // WordPress methods
  getAllWordPressPosts(): Promise<WordPressPost[]>;
  getWordPressPost(id: number): Promise<WordPressPost | undefined>;
  createWordPressPost(post: InsertWordPressPost): Promise<WordPressPost>;
  updateWordPressPost(id: number, post: Partial<InsertWordPressPost>): Promise<WordPressPost | undefined>;

  // Social Media methods
  getAllSocialPosts(): Promise<SocialPost[]>;
  getSocialPost(id: number): Promise<SocialPost | undefined>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  updateSocialPost(id: number, post: Partial<InsertSocialPost>): Promise<SocialPost | undefined>;

  // Lead methods
  getAllLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;

  // Task methods
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;

  // Activity methods
  getAllActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // SEO methods
  getAllSeoKeywords(): Promise<SeoKeyword[]>;
  createSeoKeyword(keyword: InsertSeoKeyword): Promise<SeoKeyword>;
  updateSeoKeyword(id: number, keyword: Partial<InsertSeoKeyword>): Promise<SeoKeyword | undefined>;

  // Review methods
  getAllReviews(): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;

  // Analytics methods
  getAllAnalyticsReports(): Promise<AnalyticsReport[]>;
  getAnalyticsReport(id: number): Promise<AnalyticsReport | undefined>;
  createAnalyticsReport(report: InsertAnalyticsReport): Promise<AnalyticsReport>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wordpressPosts: Map<number, WordPressPost>;
  private socialPosts: Map<number, SocialPost>;
  private leads: Map<number, Lead>;
  private tasks: Map<number, Task>;
  private activities: Map<number, Activity>;
  private seoKeywords: Map<number, SeoKeyword>;
  private reviews: Map<number, Review>;
  private analyticsReports: Map<number, AnalyticsReport>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.wordpressPosts = new Map();
    this.socialPosts = new Map();
    this.leads = new Map();
    this.tasks = new Map();
    this.activities = new Map();
    this.seoKeywords = new Map();
    this.reviews = new Map();
    this.analyticsReports = new Map();
    this.currentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // WordPress methods
  async getAllWordPressPosts(): Promise<WordPressPost[]> {
    return Array.from(this.wordpressPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getWordPressPost(id: number): Promise<WordPressPost | undefined> {
    return this.wordpressPosts.get(id);
  }

  async createWordPressPost(insertPost: InsertWordPressPost): Promise<WordPressPost> {
    const id = this.currentId++;
    const post: WordPressPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
    };
    this.wordpressPosts.set(id, post);
    return post;
  }

  async updateWordPressPost(id: number, updates: Partial<InsertWordPressPost>): Promise<WordPressPost | undefined> {
    const existing = this.wordpressPosts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.wordpressPosts.set(id, updated);
    return updated;
  }

  // Social Media methods
  async getAllSocialPosts(): Promise<SocialPost[]> {
    return Array.from(this.socialPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getSocialPost(id: number): Promise<SocialPost | undefined> {
    return this.socialPosts.get(id);
  }

  async createSocialPost(insertPost: InsertSocialPost): Promise<SocialPost> {
    const id = this.currentId++;
    const post: SocialPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
    };
    this.socialPosts.set(id, post);
    return post;
  }

  async updateSocialPost(id: number, updates: Partial<InsertSocialPost>): Promise<SocialPost | undefined> {
    const existing = this.socialPosts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.socialPosts.set(id, updated);
    return updated;
  }

  // Lead methods
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentId++;
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const existing = this.leads.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.leads.set(id, updated);
    return updated;
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.tasks.set(id, updated);
    return updated;
  }

  // Activity methods
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  // SEO methods
  async getAllSeoKeywords(): Promise<SeoKeyword[]> {
    return Array.from(this.seoKeywords.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createSeoKeyword(insertKeyword: InsertSeoKeyword): Promise<SeoKeyword> {
    const id = this.currentId++;
    const keyword: SeoKeyword = {
      ...insertKeyword,
      id,
      createdAt: new Date(),
    };
    this.seoKeywords.set(id, keyword);
    return keyword;
  }

  async updateSeoKeyword(id: number, updates: Partial<InsertSeoKeyword>): Promise<SeoKeyword | undefined> {
    const existing = this.seoKeywords.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.seoKeywords.set(id, updated);
    return updated;
  }

  // Review methods
  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  async updateReview(id: number, updates: Partial<InsertReview>): Promise<Review | undefined> {
    const existing = this.reviews.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.reviews.set(id, updated);
    return updated;
  }

  // Analytics methods
  async getAllAnalyticsReports(): Promise<AnalyticsReport[]> {
    return Array.from(this.analyticsReports.values()).sort((a, b) => 
      new Date(b.generatedAt!).getTime() - new Date(a.generatedAt!).getTime()
    );
  }

  async getAnalyticsReport(id: number): Promise<AnalyticsReport | undefined> {
    return this.analyticsReports.get(id);
  }

  async createAnalyticsReport(insertReport: InsertAnalyticsReport): Promise<AnalyticsReport> {
    const id = this.currentId++;
    const report: AnalyticsReport = {
      ...insertReport,
      id,
      generatedAt: new Date(),
    };
    this.analyticsReports.set(id, report);
    return report;
  }
}

export const storage = new MemStorage();
