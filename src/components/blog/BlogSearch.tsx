'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react'

interface BlogSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedSort: string
  onSortChange: (sort: string) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
  showAdvancedFilters?: boolean
  onToggleAdvancedFilters?: () => void
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  selectedTags,
  onTagsChange,
  availableTags,
  showAdvancedFilters = false,
  onToggleAdvancedFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'news', label: 'News' },
    { value: 'opinion', label: 'Opinion' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: Calendar },
    { value: 'oldest', label: 'Oldest', icon: Clock },
    { value: 'popular', label: 'Popular', icon: TrendingUp },
    { value: 'trending', label: 'Trending', icon: Star }
  ]

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearAllFilters = () => {
    onSearchChange('')
    onCategoryChange('all')
    onSortChange('newest')
    onTagsChange([])
  }

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedSort !== 'newest' || selectedTags.length > 0

  return (
    <div className="space-y-3">
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background border-border"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px] bg-background border-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[120px] bg-background border-border">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3 h-3" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-background border-border hover:bg-accent/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading">Advanced Filters</CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-foreground hover:text-foreground h-8"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {/* Tags Filter */}
            <div>
              <h4 className="font-medium text-foreground mb-2 text-sm">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors text-xs ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'hover:bg-primary/10'
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-border">
                <h4 className="font-medium text-foreground mb-2 text-sm">Active Filters</h4>
                <div className="flex flex-wrap gap-1">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
                      <span>&quot;{searchTerm.length > 20 ? searchTerm.substring(0, 20) + '...' : searchTerm}&quot;</span>
                      <button
                        onClick={() => onSearchChange('')}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {selectedCategory !== 'all' && (
                    <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
                      <span>{categories.find(c => c.value === selectedCategory)?.label}</span>
                      <button
                        onClick={() => onCategoryChange('all')}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {selectedSort !== 'newest' && (
                    <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
                      <span>{sortOptions.find(s => s.value === selectedSort)?.label}</span>
                      <button
                        onClick={() => onSortChange('newest')}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1 text-xs">
                      <span>{tag}</span>
                      <button
                        onClick={() => handleTagToggle(tag)}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Filter Pills */}
      {!isExpanded && hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
              <Search className="w-3 h-3" />
              <span>&quot;{searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}&quot;</span>
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
              <span>{categories.find(c => c.value === selectedCategory)?.label}</span>
              <button
                onClick={() => onCategoryChange('all')}
                className="ml-1 hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {selectedTags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center space-x-1 text-xs">
              <span>{tag}</span>
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {selectedTags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{selectedTags.length - 3} tags
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-foreground hover:text-foreground h-7 px-2 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}

export default BlogSearch