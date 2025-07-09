import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- SQLite-Compatible Tables --- //

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const wordpressPosts = sqliteTable("wordpress_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  publishedAt: text("published_at"),
  metaDescription: text("meta_description"),
  categories: text("categories"),
  tags: text("tags"),
  featuredImage: text("featured_image"),
  seoScore: integer("seo_score"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("pending"),
  aiResponse: text("ai_response"),
  responseStatus: text("response_status").default("draft"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const analyticsReports = sqliteTable("analytics_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  period: text("period").notNull(),
  traffic: integer("traffic").notNull(),
  conversions: integer("conversions").notNull(),
  topKeywords: text("top_keywords"),
  topPages: text("top_pages"),
  trafficSources: text("traffic_sources"),
  generatedAt: text("generated_at").default("CURRENT_TIMESTAMP"),
});

export const socialPosts = sqliteTable("social_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("scheduled"),
  scheduledFor: text("scheduled_for"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  service: text("service").notNull(),
  location: text("location").notNull(),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  progress: integer("progress").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  completedAt: text("completed_at"),
});

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const seoKeywords = sqliteTable("seo_keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyword: text("keyword").notNull(),
  position: integer("position"),
  previousPosition: integer("previous_position"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
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

// --- Type Inference --- //

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WordPressPost = typeof wordpressPosts.$inferSelect;
export type InsertWordPressPost = z.infer<typeof insertWordPressPostSchema>;
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