import { pgTable, foreignKey, unique, text, timestamp, integer, varchar, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const blog = pgTable("blog", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "blog_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	tags: text().array(),
	title: varchar({ length: 255 }).notNull(),
	content: varchar({ length: 1000 }).notNull(),
	authorId: text("author_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "blog_author_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const blogCategories = pgTable("blog_categories", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "blog_categories_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	blogId: integer("blog_id").notNull(),
	categoryId: integer("category_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "blog_categories_blog_id_blog_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "blog_categories_category_id_categories_id_fk"
		}).onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
});

export const blogViews = pgTable("blog_views", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "blog_views_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	blogId: integer("blog_id").notNull(),
	userId: text("user_id"),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: varchar("user_agent", { length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "blog_views_blog_id_blog_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "blog_views_user_id_user_id_fk"
		}).onDelete("set null"),
]);

export const blogRevisions = pgTable("blog_revisions", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "blog_revisions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	blogId: integer("blog_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	tags: text().array(),
	version: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "blog_revisions_blog_id_blog_id_fk"
		}).onDelete("cascade"),
]);

export const bookmarks = pgTable("bookmarks", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "bookmarks_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: text("user_id").notNull(),
	blogId: integer("blog_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "bookmarks_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "bookmarks_blog_id_blog_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const comments = pgTable("comments", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "comments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: text("user_id").notNull(),
	blogId: integer("blog_id").notNull(),
	content: varchar({ length: 500 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "comments_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "comments_blog_id_blog_id_fk"
		}).onDelete("cascade"),
]);

export const followers = pgTable("followers", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "followers_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	followerId: text("follower_id").notNull(),
	followingId: text("following_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.followerId],
			foreignColumns: [user.id],
			name: "followers_follower_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.followingId],
			foreignColumns: [user.id],
			name: "followers_following_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const history = pgTable("history", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "history_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: text("user_id").notNull(),
	blogId: integer("blog_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "history_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "history_blog_id_blog_id_fk"
		}).onDelete("cascade"),
]);

export const reports = pgTable("reports", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "reports_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	reporterId: text("reporter_id").notNull(),
	contentType: varchar("content_type", { length: 20 }).notNull(),
	contentId: integer("content_id").notNull(),
	reason: varchar({ length: 100 }).notNull(),
	description: text(),
	status: varchar({ length: 20 }).default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.reporterId],
			foreignColumns: [user.id],
			name: "reports_reporter_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const categories = pgTable("categories", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "categories_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("categories_name_unique").on(table.name),
	unique("categories_slug_unique").on(table.slug),
]);

export const likes = pgTable("likes", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "likes_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: text("user_id").notNull(),
	blogId: integer("blog_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "likes_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "likes_blog_id_blog_id_fk"
		}).onDelete("cascade"),
]);

export const notifications = pgTable("notifications", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "notifications_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: text("user_id").notNull(),
	type: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	relatedId: integer("related_id"),
	isRead: integer("is_read").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "notifications_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const userProfiles = pgTable("user_profiles", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "user_profiles_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: text("user_id").notNull(),
	firstName: varchar("first_name", { length: 100 }),
	lastName: varchar("last_name", { length: 100 }),
	bio: text(),
	avatar: varchar({ length: 500 }),
	website: varchar({ length: 255 }),
	location: varchar({ length: 100 }),
	dateOfBirth: timestamp("date_of_birth", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_profiles_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("user_profiles_user_id_unique").on(table.userId),
]);
