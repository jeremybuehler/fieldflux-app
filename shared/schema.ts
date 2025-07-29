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

// User onboarding and progress tracking
export const userOnboarding = pgTable("user_onboarding", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  businessName: text("business_name"),
  businessType: text("business_type"),
  teamSize: text("team_size"),
  yearsInBusiness: text("years_in_business"),
  serviceArea: text("service_area"),
  monthlyBudget: text("monthly_budget"),
  primaryGoals: text("primary_goals").array(),
  currentChallenges: text("current_challenges").array(),
  currentMarketing: text("current_marketing").array(),
  socialPlatforms: text("social_platforms").array(),
  hasWebsite: boolean("has_website").default(false),
  websiteUrl: text("website_url"),
  businessDescription: text("business_description"),
  aiRecommendations: jsonb("ai_recommendations"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements and gamification
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: text("achievement_id").notNull(),
  progress: integer("progress").default(0),
  maxProgress: integer("max_progress").default(1),
  isUnlocked: boolean("is_unlocked").default(false),
  isCompleted: boolean("is_completed").default(false),
  unlockedAt: timestamp("unlocked_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress and leveling
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  experiencePoints: integer("experience_points").default(0),
  streak: integer("streak").default(0),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email delivery tracking
export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  emailType: text("email_type").notNull(), // 'onboarding_plan', 'achievement_unlock', etc.
  recipientEmail: text("recipient_email").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'sent', 'failed'
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
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
  leadScore: integer("lead_score").default(0),
  aiRecommendations: text("ai_recommendations").array(),
  engagementLevel: text("engagement_level").default("unknown"),
  predictedValue: integer("predicted_value"),
  urgencyScore: integer("urgency_score").default(50),
  conversionProbability: decimal("conversion_probability", { precision: 5, scale: 2 }),
  lastContactedAt: timestamp("last_contacted_at"),
  nextFollowUpAt: timestamp("next_follow_up_at"),
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

// Social Media Platform Configurations
export const socialMediaConfigs = pgTable("social_media_configs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // facebook, instagram, twitter, linkedin
  appId: text("app_id"),
  appSecret: text("app_secret"),
  accessToken: text("access_token"),
  accessTokenSecret: text("access_token_secret"),
  clientId: text("client_id"),
  clientSecret: text("client_secret"),
  pageId: text("page_id"),
  businessAccountId: text("business_account_id"),
  organizationId: text("organization_id"),
  isConfigured: boolean("is_configured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social Media Post Analytics
export const socialMediaAnalytics = pgTable("social_media_analytics", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => socialPosts.id),
  platform: text("platform").notNull(),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  reach: integer("reach").default(0),
  impressions: integer("impressions").default(0),
  clickThrough: integer("click_through").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const insertSocialMediaConfigSchema = createInsertSchema(socialMediaConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialMediaAnalyticsSchema = createInsertSchema(socialMediaAnalytics).omit({
  id: true,
  recordedAt: true,
});

// User Engagement Tracking Tables
export const userEngagementSessions = pgTable("user_engagement_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  pagesVisited: text("pages_visited").array(),
  actionsPerformed: text("actions_performed").array(),
  clicksCount: integer("clicks_count").default(0),
  scrollDepth: decimal("scroll_depth", { precision: 5, scale: 2 }),
  deviceType: text("device_type"), // desktop, mobile, tablet
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userEngagementMetrics = pgTable("user_engagement_metrics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  totalSessions: integer("total_sessions").default(0),
  totalTimeSpent: integer("total_time_spent").default(0), // in seconds
  averageSessionDuration: decimal("average_session_duration", { precision: 10, scale: 2 }),
  featuresUsed: text("features_used").array(),
  actionsCompleted: integer("actions_completed").default(0),
  goalsAchieved: integer("goals_achieved").default(0),
  engagementScore: decimal("engagement_score", { precision: 5, scale: 2 }),
  productivityScore: decimal("productivity_score", { precision: 5, scale: 2 }),
  weeklyGoals: jsonb("weekly_goals"), // JSON array of goals
  weeklyProgress: jsonb("weekly_progress"), // JSON object with progress data
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiCoachInsights = pgTable("ai_coach_insights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  insightType: text("insight_type").notNull(), // recommendation, achievement, warning, tip
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionable: text("actionable"), // specific action user can take
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  category: text("category").notNull(), // engagement, productivity, features, goals
  isRead: boolean("is_read").default(false),
  isActionTaken: boolean("is_action_taken").default(false),
  relatedFeature: text("related_feature"), // which feature this insight relates to
  metadata: jsonb("metadata"), // additional context data
  validUntil: timestamp("valid_until"), // when this insight expires
  createdAt: timestamp("created_at").defaultNow(),
});

export const userGoals = pgTable("user_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  goalType: text("goal_type").notNull(), // daily, weekly, monthly, custom
  title: text("title").notNull(),
  description: text("description"),
  targetValue: integer("target_value"),
  currentValue: integer("current_value").default(0),
  unit: text("unit"), // posts, leads, minutes, etc.
  category: text("category").notNull(), // content, leads, engagement, productivity
  status: text("status").notNull().default("active"), // active, completed, paused, cancelled
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  priority: text("priority").default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserEngagementSessionSchema = createInsertSchema(userEngagementSessions).omit({
  id: true,
  createdAt: true,
});

export const insertUserEngagementMetricsSchema = createInsertSchema(userEngagementMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertAiCoachInsightSchema = createInsertSchema(aiCoachInsights).omit({
  id: true,
  createdAt: true,
});

export const insertUserGoalSchema = createInsertSchema(userGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for the AI Coach system
export type UserEngagementSession = typeof userEngagementSessions.$inferSelect;
export type UserEngagementMetrics = typeof userEngagementMetrics.$inferSelect;
export type AiCoachInsight = typeof aiCoachInsights.$inferSelect;
export type UserGoal = typeof userGoals.$inferSelect;

// White-label and multi-client configuration tables
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain").unique(),
  logo: text("logo"),
  primaryColor: text("primary_color").default("#3b82f6"),
  secondaryColor: text("secondary_color").default("#f97316"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clientConfigurations = pgTable("client_configurations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  userId: varchar("user_id").references(() => users.id),
  businessName: text("business_name"),
  businessAddress: text("business_address"),
  businessPhone: text("business_phone"),
  businessEmail: text("business_email"),
  businessWebsite: text("business_website"),
  businessDefaultSearch: text("business_default_search"), // For Google Places API
  industry: text("industry"),
  timezone: text("timezone").default("America/New_York"),
  currency: text("currency").default("USD"),
  // Google Analytics
  gaPropertyId: text("ga_property_id"),
  gaServiceAccountKey: text("ga_service_account_key"),
  // Google Places API
  googlePlacesApiKey: text("google_places_api_key"),
  // Twilio SMS
  twilioAccountSid: text("twilio_account_sid"),
  twilioAuthToken: text("twilio_auth_token"),
  twilioPhoneNumber: text("twilio_phone_number"),
  // WordPress/GoDaddy
  wordpressSiteUrl: text("wordpress_site_url"),
  wordpressUsername: text("wordpress_username"),
  wordpressAppPassword: text("wordpress_app_password"),
  // Social Media APIs
  facebookAppId: text("facebook_app_id"),
  facebookAppSecret: text("facebook_app_secret"),
  facebookAccessToken: text("facebook_access_token"),
  facebookPageId: text("facebook_page_id"),
  twitterApiKey: text("twitter_api_key"),
  twitterApiSecret: text("twitter_api_secret"),
  twitterAccessToken: text("twitter_access_token"),
  twitterAccessTokenSecret: text("twitter_access_token_secret"),
  instagramAccessToken: text("instagram_access_token"),
  instagramBusinessId: text("instagram_business_id"),
  linkedinClientId: text("linkedin_client_id"),
  linkedinClientSecret: text("linkedin_client_secret"),
  linkedinAccessToken: text("linkedin_access_token"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientConfigurationSchema = createInsertSchema(clientConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
export type SocialMediaConfig = typeof socialMediaConfigs.$inferSelect;
export type InsertSocialMediaConfig = z.infer<typeof insertSocialMediaConfigSchema>;
export type SocialMediaAnalytics = typeof socialMediaAnalytics.$inferSelect;
export type InsertSocialMediaAnalytics = z.infer<typeof insertSocialMediaAnalyticsSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type ClientConfiguration = typeof clientConfigurations.$inferSelect;
export type InsertClientConfiguration = z.infer<typeof insertClientConfigurationSchema>;

// User onboarding types
export const insertUserOnboardingSchema = createInsertSchema(userOnboarding).omit({ id: true, createdAt: true });
export type InsertUserOnboarding = z.infer<typeof insertUserOnboardingSchema>;
export type UserOnboarding = typeof userOnboarding.$inferSelect;

// User achievements types
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, createdAt: true });
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

// User progress types
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgressData = typeof userProgress.$inferSelect;

// Email logs types
export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({ id: true, createdAt: true });
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;
