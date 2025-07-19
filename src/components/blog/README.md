# Blog Frontend Components

This directory contains all the frontend components for the blog functionality of the portfolio application.

## Components

### BlogCard
A reusable card component for displaying blog posts in lists.

**Props:**
- `blog: Blog` - The blog post data
- `onLike?: (blogId: string) => void` - Callback for like action
- `onBookmark?: (blogId: string) => void` - Callback for bookmark action
- `onReadMore?: (blogId: string) => void` - Callback for read more action
- `isLiked?: boolean` - Whether the post is liked by current user
- `isBookmarked?: boolean` - Whether the post is bookmarked by current user
- `showActions?: boolean` - Whether to show action buttons

**Features:**
- Responsive design with hover effects
- Author information with avatar
- Post metadata (views, likes, comments)
- Tag display with overflow handling
- Interactive like and bookmark buttons

### BlogSearch
Advanced search and filter component for blog posts.

**Props:**
- `searchTerm: string` - Current search term
- `onSearchChange: (term: string) => void` - Search term change handler
- `selectedCategory: string` - Currently selected category
- `onCategoryChange: (category: string) => void` - Category change handler
- `selectedSort: string` - Currently selected sort option
- `onSortChange: (sort: string) => void` - Sort change handler
- `selectedTags: string[]` - Currently selected tags
- `onTagsChange: (tags: string[]) => void` - Tags change handler
- `availableTags: string[]` - Available tags for filtering

**Features:**
- Real-time search with clear functionality
- Category and sort dropdowns
- Advanced tag filtering
- Active filters display
- Expandable advanced filters panel

### BlogStats
Statistics and analytics component for blog dashboard.

**Props:**
- `totalPosts: number` - Total number of blog posts
- `totalViews: number` - Total views across all posts
- `totalLikes: number` - Total likes across all posts
- `totalComments: number` - Total comments across all posts
- `totalFollowers?: number` - Total followers
- `totalBookmarks?: number` - Total bookmarks
- `averageViews?: number` - Average views per post
- `topPerformingPost?: { title: string; views: number }` - Top performing post
- `recentActivity?: Array<{ type: string; count: number; timeAgo: string }>` - Recent activity

**Features:**
- Formatted number display (K, M suffixes)
- Engagement rate calculations
- Top performing post highlight
- Recent activity timeline
- Color-coded activity types

### BlogComments
Comments section component with nested replies and user interactions.

**Props:**
- `comments: Comment[]` - Array of comments
- `currentUserId?: string` - Current user ID
- `onAddComment: (content: string) => void` - Add comment handler
- `onLikeComment?: (commentId: number) => void` - Like comment handler
- `onReplyComment?: (commentId: number, content: string) => void` - Reply handler
- `onEditComment?: (commentId: number, content: string) => void` - Edit handler
- `onDeleteComment?: (commentId: number) => void` - Delete handler
- `onReportComment?: (commentId: number) => void` - Report handler
- `loading?: boolean` - Loading state

**Features:**
- Nested comment replies
- Real-time comment editing
- Like/unlike comments
- Author badge for blog authors
- Comment moderation (edit/delete for own comments)
- Report functionality for inappropriate comments
- Relative time display (e.g., "2h ago")

## Usage Examples

### Basic Blog Card
```tsx
import { BlogCard } from '@/components/blog'

<BlogCard
  blog={blogData}
  onReadMore={(blogId) => router.push(`/blog/${blogId}`)}
  onLike={(blogId) => handleLike(blogId)}
  onBookmark={(blogId) => handleBookmark(blogId)}
/>
```

### Search and Filter
```tsx
import { BlogSearch } from '@/components/blog'

<BlogSearch
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  selectedCategory={category}
  onCategoryChange={setCategory}
  selectedSort={sort}
  onSortChange={setSort}
  selectedTags={tags}
  onTagsChange={setTags}
  availableTags={['technology', 'lifestyle', 'tutorial']}
/>
```

### Blog Statistics
```tsx
import { BlogStats } from '@/components/blog'

<BlogStats
  totalPosts={blogs.length}
  totalViews={totalViews}
  totalLikes={totalLikes}
  totalComments={totalComments}
  averageViews={averageViews}
  topPerformingPost={topPost}
  recentActivity={recentActivity}
/>
```

### Comments Section
```tsx
import { BlogComments } from '@/components/blog'

<BlogComments
  comments={comments}
  currentUserId={session?.user?.id}
  onAddComment={handleAddComment}
  onLikeComment={handleLikeComment}
  onReplyComment={handleReplyComment}
  onEditComment={handleEditComment}
  onDeleteComment={handleDeleteComment}
  onReportComment={handleReportComment}
  loading={loading}
/>
```

## Styling

All components use the design system defined in `globals.css` and follow the portfolio's color scheme:

- **Primary**: `#00d49e` (light) / `#dfdd10` (dark)
- **Secondary**: `#89cb0f` (light) / `#4ed0ff` (dark)
- **Accent**: `#89cb0f` (light) / `#4ed0ff` (dark)
- **Background**: Gradient from background to card to muted
- **Cards**: Semi-transparent with backdrop blur

Components include:
- Hover effects and transitions
- Responsive design
- Dark/light theme support
- Accessibility features
- Loading states
- Error handling

## Integration

These components are designed to work with the blog API services in `src/services/blogs/` and integrate seamlessly with the authentication system using `authClient` from `@/lib/authClient`.

The components follow React best practices and use TypeScript for type safety. 