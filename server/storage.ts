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
  socialMediaAnalytics,
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
  type SocialMediaAnalytics,
  type InsertSocialMediaAnalytics,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

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

  // Social Media Analytics methods
  getAllSocialMediaAnalytics(): Promise<SocialMediaAnalytics[]>;
  createSocialMediaAnalytics(
    data: InsertSocialMediaAnalytics
  ): Promise<SocialMediaAnalytics>;
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
  private socialMediaAnalytics: Map<number, SocialMediaAnalytics>;
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
    this.socialMediaAnalytics = new Map();
    this.currentId = 1;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return undefined;
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

  async getAllSocialMediaAnalytics(): Promise<SocialMediaAnalytics[]> {
    return Array.from(this.socialMediaAnalytics.values()).sort((a, b) =>
      new Date(b.dateRecorded!).getTime() - new Date(a.dateRecorded!).getTime()
    );
  }

  async createSocialMediaAnalytics(
    data: InsertSocialMediaAnalytics
  ): Promise<SocialMediaAnalytics> {
    const id = this.currentId++;
    const record: SocialMediaAnalytics = {
      ...data,
      id,
      dateRecorded: new Date(),
    };
    this.socialMediaAnalytics.set(id, record);
    return record;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // For Replit Auth, we don't use username lookup
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // WordPress methods
  async getAllWordPressPosts(): Promise<WordPressPost[]> {
    return await db.select().from(wordpressPosts).orderBy(wordpressPosts.createdAt);
  }

  async getWordPressPost(id: number): Promise<WordPressPost | undefined> {
    const [post] = await db.select().from(wordpressPosts).where(eq(wordpressPosts.id, id));
    return post || undefined;
  }

  async createWordPressPost(insertPost: InsertWordPressPost): Promise<WordPressPost> {
    const [post] = await db
      .insert(wordpressPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateWordPressPost(id: number, updates: Partial<InsertWordPressPost>): Promise<WordPressPost | undefined> {
    const [post] = await db
      .update(wordpressPosts)
      .set(updates)
      .where(eq(wordpressPosts.id, id))
      .returning();
    return post || undefined;
  }

  // Social Media methods
  async getAllSocialPosts(): Promise<SocialPost[]> {
    return await db.select().from(socialPosts).orderBy(socialPosts.scheduledFor);
  }

  async getSocialPost(id: number): Promise<SocialPost | undefined> {
    const [post] = await db.select().from(socialPosts).where(eq(socialPosts.id, id));
    return post || undefined;
  }

  async createSocialPost(insertPost: InsertSocialPost): Promise<SocialPost> {
    const [post] = await db
      .insert(socialPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateSocialPost(id: number, updates: Partial<InsertSocialPost>): Promise<SocialPost | undefined> {
    const [post] = await db
      .update(socialPosts)
      .set(updates)
      .where(eq(socialPosts.id, id))
      .returning();
    return post || undefined;
  }

  // Lead methods
  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(leads.createdAt);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const [lead] = await db
      .update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning();
    return lead || undefined;
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(tasks.createdAt);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  // Activity methods
  async getAllActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(activities.createdAt);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  // SEO methods
  async getAllSeoKeywords(): Promise<SeoKeyword[]> {
    return await db.select().from(seoKeywords).orderBy(seoKeywords.createdAt);
  }

  async createSeoKeyword(insertKeyword: InsertSeoKeyword): Promise<SeoKeyword> {
    const [keyword] = await db
      .insert(seoKeywords)
      .values(insertKeyword)
      .returning();
    return keyword;
  }

  async updateSeoKeyword(id: number, updates: Partial<InsertSeoKeyword>): Promise<SeoKeyword | undefined> {
    const [keyword] = await db
      .update(seoKeywords)
      .set(updates)
      .where(eq(seoKeywords.id, id))
      .returning();
    return keyword || undefined;
  }

  // Review methods
  async getAllReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(reviews.createdAt);
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async updateReview(id: number, updates: Partial<InsertReview>): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set(updates)
      .where(eq(reviews.id, id))
      .returning();
    return review || undefined;
  }

  // Analytics methods
  async getAllAnalyticsReports(): Promise<AnalyticsReport[]> {
    return await db.select().from(analyticsReports).orderBy(analyticsReports.generatedAt);
  }

  async getAnalyticsReport(id: number): Promise<AnalyticsReport | undefined> {
    const [report] = await db.select().from(analyticsReports).where(eq(analyticsReports.id, id));
    return report || undefined;
  }

  async createAnalyticsReport(insertReport: InsertAnalyticsReport): Promise<AnalyticsReport> {
    const [report] = await db
      .insert(analyticsReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getAllSocialMediaAnalytics(): Promise<SocialMediaAnalytics[]> {
    return await db
      .select()
      .from(socialMediaAnalytics)
      .orderBy(socialMediaAnalytics.dateRecorded);
  }

  async createSocialMediaAnalytics(
    data: InsertSocialMediaAnalytics
  ): Promise<SocialMediaAnalytics> {
    const [record] = await db
      .insert(socialMediaAnalytics)
      .values(data)
      .returning();
    return record;
  }
}

// Use MemStorage for now to avoid database connection issues
export const storage = new DatabaseStorage();
