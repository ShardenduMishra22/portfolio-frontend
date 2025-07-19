// Common API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User types
export interface User {
  id: string; // Changed from number to string to match API
  email: string;
  username?: string; // Made optional since API doesn't always return it
  name?: string; // Added name field that API returns
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
}

// Profile types
export interface Profile {
  id: number;
  userId: number;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
}

// Blog types
export interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  authorId: string; // Changed from number to string to match API
  author?: {
    id: string;
    email: string;
  };
  authorProfile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  tags?: string[]; // Added tags field
  categories?: Category[];
  likes?: Like[];
  comments?: Comment[];
  bookmarks?: Bookmark[];
  views?: BlogView[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  categoryIds?: number[];
  tags?: string[];
  authorId: string;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  categoryIds?: number[];
}

// Comment types
export interface Comment {
  id: number;
  content: string;
  blogId: number;
  userId: string; // Changed from number to string to match API
  user?: {
    id: string;
    email: string;
  };
  userProfile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCommentRequest {
  content: string;
  userId: string; // Added userId to match API requirements
  blogId?: number; // Made optional since it's passed in URL
}

export interface UpdateCommentRequest {
  content: string;
}

// Like types
export interface Like {
  id: number;
  blogId: number;
  userId: number;
  createdAt: string;
}

// Bookmark types
export interface Bookmark {
  id: number;
  blogId: number;
  userId: number;
  createdAt: string;
}

// History types
export interface History {
  id: number;
  blogId: number;
  userId: number;
  createdAt: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
}

// Follower types
export interface Follower {
  id: number;
  followerId: number;
  followingId: number;
  follower?: User;
  following?: User;
  createdAt: string;
}

// Blog View types
export interface BlogView {
  id: number;
  blogId: number;
  userId?: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Notification types
export interface Notification {
  id: number;
  userId: number;
  type: 'like' | 'comment' | 'follow' | 'mention';
  title: string;
  message: string;
  read: boolean;
  relatedId?: number;
  createdAt: string;
}

export interface CreateNotificationRequest {
  userId: number;
  type: 'like' | 'comment' | 'follow' | 'mention';
  title: string;
  message: string;
  relatedId?: number;
}

// Report types
export interface Report {
  id: number;
  reporterId: number;
  reporter?: User;
  type: 'blog' | 'comment' | 'user';
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  relatedId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  type: 'blog' | 'comment' | 'user';
  reason: string;
  relatedId: number;
}

export interface UpdateReportStatusRequest {
  status: 'pending' | 'resolved' | 'dismissed';
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 