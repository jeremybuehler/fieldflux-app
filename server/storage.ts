import {
  users,
  tenants,
  tenantDomains,
  oauthConnections,
  memberships,
  wordpressPosts,
  socialPosts,
  leads,
  tasks,
  activities,
  seoKeywords,
  reviews,
  analyticsReports,
  socialMediaConfigs,
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
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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

  // Social media config/analytics (optional in-memory/dev)
  getAllSocialMediaConfigs?(tenantId?: number): Promise<any[]>;
  createSocialMediaConfig?(config: any): Promise<any>;
  deleteSocialMediaConfig?(id: number): Promise<boolean>;
  getAllSocialMediaAnalytics?(tenantId?: number): Promise<any[]>;
  createSocialMediaAnalytics?(analytics: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private membershipsMem: Array<{ tenantId: number; userId: string; role: string; status: string }>;
  private wordpressPosts: Map<number, WordPressPost>;
  private socialPosts: Map<number, SocialPost>;
  private leads: Map<number, Lead>;
  private tasks: Map<number, Task>;
  private activities: Map<number, Activity>;
  private seoKeywords: Map<number, SeoKeyword>;
  private reviews: Map<number, Review>;
  private analyticsReports: Map<number, AnalyticsReport>;
  private socialConfigs: Array<any>;
  private socialAnalytics: Array<any>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.membershipsMem = [];
    this.wordpressPosts = new Map();
    this.socialPosts = new Map();
    this.leads = new Map();
    this.tasks = new Map();
    this.activities = new Map();
    this.seoKeywords = new Map();
    this.reviews = new Map();
    this.analyticsReports = new Map();
    this.socialConfigs = [];
    this.socialAnalytics = [];
    this.currentId = 1;
  }

  // Tenancy helpers (in-memory stubs)
  async getTenantByDomain(_domain: string): Promise<{ id: number; slug: string; name: string } | null> {
    // Return a predictable dev tenant so behind-login pages work without a DB
    return { id: 1, slug: "dev", name: "Dev Tenant" };
  }

  async getTenantOauthConnection(_tenantId: number) {
    return null;
  }

  async getMembership(tenantId: number, userId: string) {
    return this.membershipsMem.find(m => m.tenantId === tenantId && m.userId === userId) || null;
  }

  async createMembership(tenantId: number, userId: string, role: string = 'member') {
    const exists = await this.getMembership(tenantId, userId);
    if (exists) return exists;
    const row = { tenantId, userId, role, status: 'active' };
    this.membershipsMem.push(row);
    return row as any;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const userArray = Array.from(this.users.values());
    return userArray.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      ...insertUser,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      stripeCustomerId: insertUser.stripeCustomerId || null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId || null,
      subscriptionStatus: insertUser.subscriptionStatus || "free",
      subscriptionPlan: insertUser.subscriptionPlan || "free",
      subscriptionCurrentPeriodEnd: insertUser.subscriptionCurrentPeriodEnd || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(this.currentId++, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = await this.getUser(userData.id);
    if (existingUser) {
      const updatedUser = { 
        ...existingUser, 
        ...userData, 
        updatedAt: new Date() 
      };
      this.users.set(this.currentId++, updatedUser);
      return updatedUser;
    } else {
      return this.createUser(userData);
    }
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
      tenantId: (insertPost as any).tenantId ?? null,
      status: insertPost.status || "draft",
      publishedAt: insertPost.publishedAt || null,
      metaDescription: insertPost.metaDescription || null,
      categories: insertPost.categories || null,
      tags: insertPost.tags || null,
      featuredImage: insertPost.featuredImage || null,
      seoScore: insertPost.seoScore || null,
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
      tenantId: (insertPost as any).tenantId ?? null,
      status: insertPost.status || "scheduled",
      scheduledFor: insertPost.scheduledFor || null,
      publishedAt: insertPost.publishedAt || null,
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
      tenantId: (insertLead as any).tenantId ?? null,
      email: insertLead.email || null,
      phone: insertLead.phone || null,
      status: insertLead.status || "new",
      priority: insertLead.priority || "medium",
      leadScore: insertLead.leadScore || null,
      aiRecommendations: insertLead.aiRecommendations || null,
      engagementLevel: insertLead.engagementLevel || "unknown",
      predictedValue: insertLead.predictedValue || null,
      urgencyScore: insertLead.urgencyScore || 50,
      conversionProbability: insertLead.conversionProbability || null,
      lastContactedAt: insertLead.lastContactedAt || null,
      nextFollowUpAt: insertLead.nextFollowUpAt || null,
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
      tenantId: (insertTask as any).tenantId ?? null,
      description: insertTask.description || null,
      status: insertTask.status || "pending",
      progress: insertTask.progress || null,
      completedAt: null,
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

  // Social media config/analytics (in-memory only)
  async getAllSocialMediaConfigs(): Promise<any[]> {
    return this.socialConfigs;
  }

  async createSocialMediaConfig(config: any): Promise<any> {
    const row = { id: this.currentId++, createdAt: new Date(), ...config };
    this.socialConfigs.push(row);
    return row;
  }

  async deleteSocialMediaConfig(id: number): Promise<boolean> {
    this.socialConfigs = this.socialConfigs.filter((c) => c.id !== id);
    return true;
  }

  async getAllSocialMediaAnalytics(): Promise<any[]> {
    return this.socialAnalytics;
  }

  async createSocialMediaAnalytics(analytics: any): Promise<any> {
    const row = { id: this.currentId++, recordedAt: new Date(), ...analytics };
    this.socialAnalytics.push(row);
    return row;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = {
      ...insertActivity,
      id,
      tenantId: (insertActivity as any).tenantId ?? null,
      description: insertActivity.description || null,
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
      tenantId: (insertKeyword as any).tenantId ?? null,
      position: insertKeyword.position || null,
      previousPosition: insertKeyword.previousPosition || null,
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
      tenantId: (insertReview as any).tenantId ?? null,
      status: insertReview.status || "pending",
      aiResponse: insertReview.aiResponse || null,
      responseStatus: insertReview.responseStatus || "draft",
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
      tenantId: (insertReport as any).tenantId ?? null,
      topKeywords: insertReport.topKeywords || null,
      topPages: insertReport.topPages || null,
      trafficSources: insertReport.trafficSources || null,
      generatedAt: new Date(),
    };
    this.analyticsReports.set(id, report);
    return report;
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

  // Tenancy helpers
  async getTenantByDomain(domain: string): Promise<{ id: number; slug: string; name: string } | null> {
    if (!domain) return null;
    const rows = await db
      .select({ id: tenants.id, slug: tenants.slug, name: tenants.name })
      .from(tenantDomains)
      .leftJoin(tenants, eq(tenants.id, tenantDomains.tenantId))
      .where(eq(tenantDomains.domain, domain))
      .limit(1);
    return rows?.[0] || null;
  }

  async getTenantOauthConnection(tenantId: number) {
    const rows = await db.select().from(oauthConnections).where(eq(oauthConnections.tenantId, tenantId)).limit(1);
    return rows?.[0] || null;
  }

  async getMembership(tenantId: number, userId: string) {
    const rows = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.tenantId, tenantId), eq(memberships.userId, userId)))
      .limit(1);
    return rows?.[0] || null;
  }

  async createMembership(tenantId: number, userId: string, role: string = 'member') {
    try {
      const [row] = await db
        .insert(memberships)
        .values({ tenantId, userId, role, status: 'active' as any })
        .returning();
      return row;
    } catch (e) {
      return null;
    }
  }

  // WordPress methods
  async getAllWordPressPosts(tenantId?: number): Promise<WordPressPost[]> {
    if (tenantId) {
      return await db
        .select()
        .from(wordpressPosts)
        .where(eq(wordpressPosts.tenantId, tenantId as any))
        .orderBy(wordpressPosts.createdAt);
    }
    return await db.select().from(wordpressPosts).orderBy(wordpressPosts.createdAt);
  }

  async getWordPressPost(id: number, tenantId?: number): Promise<WordPressPost | undefined> {
    const where = tenantId
      ? and(eq(wordpressPosts.id, id), eq(wordpressPosts.tenantId, tenantId as any))
      : eq(wordpressPosts.id, id);
    const [post] = await db.select().from(wordpressPosts).where(where);
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
  async getAllSocialPosts(tenantId?: number): Promise<SocialPost[]> {
    if (tenantId) {
      return await db
        .select()
        .from(socialPosts)
        .where(eq(socialPosts.tenantId, tenantId as any))
        .orderBy(socialPosts.scheduledFor);
    }
    return await db.select().from(socialPosts).orderBy(socialPosts.scheduledFor);
  }

  async getSocialPost(id: number, tenantId?: number): Promise<SocialPost | undefined> {
    const where = tenantId
      ? and(eq(socialPosts.id, id), eq(socialPosts.tenantId, tenantId as any))
      : eq(socialPosts.id, id);
    const [post] = await db.select().from(socialPosts).where(where);
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
  async getAllLeads(tenantId?: number): Promise<Lead[]> {
    if (tenantId) {
      return await db
        .select()
        .from(leads)
        .where(eq(leads.tenantId, tenantId as any))
        .orderBy(leads.createdAt);
    }
    return await db.select().from(leads).orderBy(leads.createdAt);
  }

  async getLead(id: number, tenantId?: number): Promise<Lead | undefined> {
    const where = tenantId ? and(eq(leads.id, id), eq(leads.tenantId, tenantId as any)) : eq(leads.id, id);
    const [lead] = await db.select().from(leads).where(where);
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
  async getAllTasks(tenantId?: number): Promise<Task[]> {
    if (tenantId) {
      return await db
        .select()
        .from(tasks)
        .where(eq(tasks.tenantId, tenantId as any))
        .orderBy(tasks.createdAt);
    }
    return await db.select().from(tasks).orderBy(tasks.createdAt);
  }

  async getTask(id: number, tenantId?: number): Promise<Task | undefined> {
    const where = tenantId ? and(eq(tasks.id, id), eq(tasks.tenantId, tenantId as any)) : eq(tasks.id, id);
    const [task] = await db.select().from(tasks).where(where);
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
  async getAllActivities(tenantId?: number): Promise<Activity[]> {
    if (tenantId) {
      return await db
        .select()
        .from(activities)
        .where(eq(activities.tenantId, tenantId as any))
        .orderBy(activities.createdAt);
    }
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
  async getAllSeoKeywords(tenantId?: number): Promise<SeoKeyword[]> {
    if (tenantId) {
      return await db
        .select()
        .from(seoKeywords)
        .where(eq(seoKeywords.tenantId, tenantId as any))
        .orderBy(seoKeywords.createdAt);
    }
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
  async getAllReviews(tenantId?: number): Promise<Review[]> {
    if (tenantId) {
      return await db
        .select()
        .from(reviews)
        .where(eq(reviews.tenantId, tenantId as any))
        .orderBy(reviews.createdAt);
    }
    return await db.select().from(reviews).orderBy(reviews.createdAt);
  }

  async getReview(id: number, tenantId?: number): Promise<Review | undefined> {
    const where = tenantId ? and(eq(reviews.id, id), eq(reviews.tenantId, tenantId as any)) : eq(reviews.id, id);
    const [review] = await db.select().from(reviews).where(where);
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
  async getAllAnalyticsReports(tenantId?: number): Promise<AnalyticsReport[]> {
    if (tenantId) {
      return await db
        .select()
        .from(analyticsReports)
        .where(eq(analyticsReports.tenantId, tenantId as any))
        .orderBy(analyticsReports.generatedAt);
    }
    return await db.select().from(analyticsReports).orderBy(analyticsReports.generatedAt);
  }

  async getAnalyticsReport(id: number, tenantId?: number): Promise<AnalyticsReport | undefined> {
    const where = tenantId ? and(eq(analyticsReports.id, id), eq(analyticsReports.tenantId, tenantId as any)) : eq(analyticsReports.id, id);
    const [report] = await db.select().from(analyticsReports).where(where);
    return report || undefined;
  }

  async createAnalyticsReport(insertReport: InsertAnalyticsReport): Promise<AnalyticsReport> {
    const [report] = await db
      .insert(analyticsReports)
      .values(insertReport)
      .returning();
    return report;
  }

  // Social Media Configuration methods
  async getAllSocialMediaConfigs(tenantId?: number): Promise<any[]> {
    if (tenantId) {
      return await db
        .select()
        .from(socialMediaConfigs)
        .where(eq(socialMediaConfigs.tenantId, tenantId as any))
        .orderBy(socialMediaConfigs.createdAt);
    }
    return await db.select().from(socialMediaConfigs).orderBy(socialMediaConfigs.createdAt);
  }

  async createSocialMediaConfig(config: any): Promise<any> {
    const [row] = await db.insert(socialMediaConfigs).values(config).returning();
    return row;
  }

  async deleteSocialMediaConfig(id: number): Promise<boolean> {
    await db.delete(socialMediaConfigs).where(eq(socialMediaConfigs.id, id));
    return true;
  }

  // Social Media Analytics methods
  async getAllSocialMediaAnalytics(tenantId?: number): Promise<any[]> {
    if (tenantId) {
      return await db
        .select()
        .from(socialMediaAnalytics)
        .where(eq(socialMediaAnalytics.tenantId, tenantId as any))
        .orderBy(socialMediaAnalytics.recordedAt);
    }
    return await db.select().from(socialMediaAnalytics).orderBy(socialMediaAnalytics.recordedAt);
  }

  async createSocialMediaAnalytics(analytics: any): Promise<any> {
    const [row] = await db.insert(socialMediaAnalytics).values(analytics).returning();
    return row;
  }
}

// Use MemStorage for now to avoid database connection issues
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
