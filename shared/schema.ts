import {
  pgTable,
  text,
  varchar,
  integer,
  serial,
  timestamp,
  boolean,
  decimal,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wordpressPosts = pgTable("wordpress_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  metaDescription: text("meta_description"),
  categories: text("categories").array(),
  tags: text("tags").array(),
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
  topKeywords: text("top_keywords").array(),
  topPages: text("top_pages").array(),
  trafficSources: text("traffic_sources").array(),
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

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;

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
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type AnalyticsReport = typeof analyticsReports.$inferSelect;
export type InsertAnalyticsReport = z.infer<typeof insertAnalyticsReportSchema>;
