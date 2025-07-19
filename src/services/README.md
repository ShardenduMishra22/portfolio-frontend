# Backend Services

This directory contains all the API service modules for communicating with the Next.js backend API. These services are separate from the proxy API calls and provide a clean, organized way to interact with the backend.

## Structure

```
src/services/
├── api.ts                    # Base API configuration for backend calls
├── types.ts                  # TypeScript types for all API requests/responses
├── index.ts                  # Main export file
├── README.md                 # This documentation
├── auth/                     # Authentication services
│   └── index.ts
├── users/                    # User management services
│   └── index.ts
├── blogs/                    # Blog management services
│   └── index.ts
├── comments/                 # Comment management services
│   └── index.ts
├── categories/               # Category management services
│   └── index.ts
├── notifications/            # Notification services
│   └── index.ts
├── reports/                  # Report management services
│   └── index.ts
├── likes/                    # Like/unlike services
│   └── index.ts
├── bookmarks/                # Bookmark services
│   └── index.ts
├── history/                  # History tracking services
│   └── index.ts
└── followers/                # Follow/unfollow services
    └── index.ts
```

## Usage

### Import Services

```typescript
import { 
  authService, 
  usersService, 
  blogsService,
  categoriesService,
  // ... other services
  type User,
  type Blog,
  type ApiResponse 
} from '@/services'
```

### Example Usage

```typescript
// Authentication
const loginResult = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

// Get blogs with pagination
const blogsResult = await blogsService.getBlogs({
  page: 1,
  limit: 10,
  search: 'react'
})

// Create a new blog
const newBlog = await blogsService.createBlog({
  title: 'My New Blog',
  content: 'Blog content...',
  excerpt: 'Blog excerpt',
  published: true,
  categoryIds: [1, 2]
})

// Like a blog
await blogsService.likeBlog('123')

// Get user profile
const profile = await usersService.getUserProfile('456')
```

## API Configuration

The base API configuration (`api.ts`) includes:

- **Base URL**: Points to `/api` (Next.js backend) instead of `/api/proxy`
- **Authentication**: Automatically adds JWT tokens to requests
- **Error Handling**: Handles 401 errors by redirecting to login
- **Timeout**: 10-second timeout for requests

## Type Safety

All services are fully typed with TypeScript interfaces for:
- Request payloads
- Response data
- Error handling
- Pagination parameters

## Error Handling

All services return a consistent `ApiResponse<T>` type:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Pagination

Services that support pagination accept `PaginationParams`:

```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

## Separation from Proxy API

This service layer is completely separate from the proxy API calls in `src/util/api.ts`. The proxy API is used for external services, while these services communicate directly with your Next.js backend API routes.

## Benefits

1. **Organized**: Each domain has its own service module
2. **Type Safe**: Full TypeScript support with proper types
3. **Consistent**: All services follow the same patterns
4. **Maintainable**: Easy to update and extend
5. **Reusable**: Can be imported anywhere in the application
6. **Testable**: Services can be easily mocked for testing 