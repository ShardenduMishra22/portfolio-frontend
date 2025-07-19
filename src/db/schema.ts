import { pgTable, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./authSchema"; // adjust path as per your structure

export const blogTable = pgTable("blog", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tags: text("tags").array(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentsTable = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  blogId: integer("blog_id").notNull().references(() => blogTable.id, { onDelete: "cascade" }),
  content: varchar("content", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const likesTable = pgTable("likes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  blogId: integer("blog_id").notNull().references(() => blogTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarksTable = pgTable("bookmarks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  blogId: integer("blog_id").notNull().references(() => blogTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const historyTable = pgTable("history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  blogId: integer("blog_id").notNull().references(() => blogTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogCategoriesTable = pgTable("blog_categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  blogId: integer("blog_id").notNull().references(() => blogTable.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const followersTable = pgTable("followers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  followerId: text("follower_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  followingId: text("following_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogViewsTable = pgTable("blog_views", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  blogId: integer("blog_id").notNull().references(() => blogTable.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsTable = pgTable("notifications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  relatedId: integer("related_id"),
  isRead: integer("is_read").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogRevisionsTable = pgTable("blog_revisions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  blogId: integer("blog_id").notNull().references(() => blogTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  version: integer("version").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reportsTable = pgTable("reports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  reporterId: text("reporter_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  contentType: varchar("content_type", { length: 20 }).notNull(),
  contentId: integer("content_id").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const userProfilesTable = pgTable("user_profiles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  bio: text("bio"),
  avatar: varchar("avatar", { length: 500 }),
  website: varchar("website", { length: 255 }),
  location: varchar("location", { length: 100 }),
  dateOfBirth: timestamp("date_of_birth"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
