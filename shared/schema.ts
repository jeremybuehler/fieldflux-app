import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- PostgreSQL-Compatible Tables --- //

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const wordpressPosts = pgTable("wordpress_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  metaDescription: text("meta_description"),
  categories: text("categories"),
  tags: text("tags"),
  featuredImage: text("featured_image"),
  seoScore: integer("seo_score"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("pending"),
  aiResponse: text("ai_response"),
  responseStatus: text("response_status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analyticsReports = pgTable("analytics_reports", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(),
  traffic: integer("traffic").notNull(),
  conversions: integer("conversions").notNull(),
  topKeywords: text("top_keywords"),
  topPages: text("top_pages"),
  trafficSources: text("traffic_sources"),
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("scheduled"),
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  service: text("service").notNull(),
  location: text("location").notNull(),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seoKeywords = pgTable("seo_keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  position: integer("position"),
  previousPosition: integer("previous_position"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Additional PostgreSQL tables for FieldPulse field service features
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  businessType: text("business_type").notNull(), // HVAC, Plumbing, Electrical, etc.
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  timezone: text("timezone").default("America/New_York"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clientConfigurations = pgTable("client_configurations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  openaiApiKey: text("openai_api_key"),
  googleAnalyticsId: text("google_analytics_id"),
  googlePlacesApiKey: text("google_places_api_key"),
  twilioAccountSid: text("twilio_account_sid"),
  twilioAuthToken: text("twilio_auth_token"),
  facebookAccessToken: text("facebook_access_token"),
  instagramAccessToken: text("instagram_access_token"),
  twitterApiKey: text("twitter_api_key"),
  linkedinAccessToken: text("linkedin_access_token"),
  customBranding: text("custom_branding"), // JSON string for white-label branding
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialMediaConfigs = pgTable("social_media_configs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  platform: text("platform").notNull(), // facebook, instagram, twitter, linkedin
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  accountId: text("account_id"),
  accountName: text("account_name"),
  isActive: integer("is_active").default(1), // 1 = active, 0 = inactive
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialMediaAnalytics = pgTable("social_media_analytics", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  platform: text("platform").notNull(),
  postId: text("post_id"),
  impressions: integer("impressions").default(0),
  engagement: integer("engagement").default(0),
  clicks: integer("clicks").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  likes: integer("likes").default(0),
  reach: integer("reach").default(0),
  dateRecorded: timestamp("date_recorded").defaultNow(),
});

// --- Insert Schemas --- //

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWordPressPostSchema = createInsertSchema(wordpressPosts).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsReportSchema = createInsertSchema(analyticsReports).omit({
  id: true,
  generatedAt: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertSeoKeywordSchema = createInsertSchema(seoKeywords).omit({
  id: true,
  createdAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertClientConfigurationSchema = createInsertSchema(clientConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialMediaConfigSchema = createInsertSchema(socialMediaConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialMediaAnalyticsSchema = createInsertSchema(socialMediaAnalytics).omit({
  id: true,
  dateRecorded: true,
});

// --- Type Inference --- //

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type WordPressPost = typeof wordpressPosts.$inferSelect;
export type InsertWordPressPost = z.infer<typeof insertWordPressPostSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type AnalyticsReport = typeof analyticsReports.$inferSelect;
export type InsertAnalyticsReport = z.infer<typeof insertAnalyticsReportSchema>;

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type SeoKeyword = typeof seoKeywords.$inferSelect;
export type InsertSeoKeyword = z.infer<typeof insertSeoKeywordSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type ClientConfiguration = typeof clientConfigurations.$inferSelect;
export type InsertClientConfiguration = z.infer<typeof insertClientConfigurationSchema>;

export type SocialMediaConfig = typeof socialMediaConfigs.$inferSelect;
export type InsertSocialMediaConfig = z.infer<typeof insertSocialMediaConfigSchema>;

export type SocialMediaAnalytics = typeof socialMediaAnalytics.$inferSelect;
export type InsertSocialMediaAnalytics = z.infer<typeof insertSocialMediaAnalyticsSchema>;

// Legacy type exports for backward compatibility
export type UpsertUser = InsertUser;