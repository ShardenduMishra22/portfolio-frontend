import { relations } from "drizzle-orm/relations";
import { user, session, blog, blogCategories, categories, blogViews, blogRevisions, bookmarks, comments, followers, history, reports, account, likes, notifications, userProfiles } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	blogs: many(blog),
	blogViews: many(blogViews),
	bookmarks: many(bookmarks),
	comments: many(comments),
	followers_followerId: many(followers, {
		relationName: "followers_followerId_user_id"
	}),
	followers_followingId: many(followers, {
		relationName: "followers_followingId_user_id"
	}),
	histories: many(history),
	reports: many(reports),
	accounts: many(account),
	likes: many(likes),
	notifications: many(notifications),
	userProfiles: many(userProfiles),
}));

export const blogRelations = relations(blog, ({one, many}) => ({
	user: one(user, {
		fields: [blog.authorId],
		references: [user.id]
	}),
	blogCategories: many(blogCategories),
	blogViews: many(blogViews),
	blogRevisions: many(blogRevisions),
	bookmarks: many(bookmarks),
	comments: many(comments),
	histories: many(history),
	likes: many(likes),
}));

export const blogCategoriesRelations = relations(blogCategories, ({one}) => ({
	blog: one(blog, {
		fields: [blogCategories.blogId],
		references: [blog.id]
	}),
	category: one(categories, {
		fields: [blogCategories.categoryId],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	blogCategories: many(blogCategories),
}));

export const blogViewsRelations = relations(blogViews, ({one}) => ({
	blog: one(blog, {
		fields: [blogViews.blogId],
		references: [blog.id]
	}),
	user: one(user, {
		fields: [blogViews.userId],
		references: [user.id]
	}),
}));

export const blogRevisionsRelations = relations(blogRevisions, ({one}) => ({
	blog: one(blog, {
		fields: [blogRevisions.blogId],
		references: [blog.id]
	}),
}));

export const bookmarksRelations = relations(bookmarks, ({one}) => ({
	user: one(user, {
		fields: [bookmarks.userId],
		references: [user.id]
	}),
	blog: one(blog, {
		fields: [bookmarks.blogId],
		references: [blog.id]
	}),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	user: one(user, {
		fields: [comments.userId],
		references: [user.id]
	}),
	blog: one(blog, {
		fields: [comments.blogId],
		references: [blog.id]
	}),
}));

export const followersRelations = relations(followers, ({one}) => ({
	user_followerId: one(user, {
		fields: [followers.followerId],
		references: [user.id],
		relationName: "followers_followerId_user_id"
	}),
	user_followingId: one(user, {
		fields: [followers.followingId],
		references: [user.id],
		relationName: "followers_followingId_user_id"
	}),
}));

export const historyRelations = relations(history, ({one}) => ({
	user: one(user, {
		fields: [history.userId],
		references: [user.id]
	}),
	blog: one(blog, {
		fields: [history.blogId],
		references: [blog.id]
	}),
}));

export const reportsRelations = relations(reports, ({one}) => ({
	user: one(user, {
		fields: [reports.reporterId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const likesRelations = relations(likes, ({one}) => ({
	user: one(user, {
		fields: [likes.userId],
		references: [user.id]
	}),
	blog: one(blog, {
		fields: [likes.blogId],
		references: [blog.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(user, {
		fields: [notifications.userId],
		references: [user.id]
	}),
}));

export const userProfilesRelations = relations(userProfiles, ({one}) => ({
	user: one(user, {
		fields: [userProfiles.userId],
		references: [user.id]
	}),
}));