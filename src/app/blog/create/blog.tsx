type BlogPostPreviewModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  content?: string
  tags?: string[]
}

export default function BlogPostPreviewModal({
  open,
  onClose,
  title,
  content,
  tags = [],
}: BlogPostPreviewModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      {/* Overlay */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 min-h-[40vh] flex flex-col justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white text-center">
            Preview Blog Post
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 text-center mt-2">
            How your post will appear to readers
          </p>
        </div>
        {/* Content */}
        <div className="flex-1 px-10 py-8 bg-zinc-50 dark:bg-zinc-800 flex flex-col gap-6 items-center max-w-5xl mx-auto w-full">
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-2 text-center leading-tight tracking-tight">
            {title || 'Your post title will appear here'}
          </h1>
          <div className="w-16 h-1 bg-zinc-300 dark:bg-zinc-600 rounded mb-4"></div>
          <div className="prose prose-lg dark:prose-invert max-w-none w-full text-zinc-800 dark:text-zinc-100 px-1 text-center">
            {/* You can use react-markdown here for rich content */}
            {content || 'Your post content will appear here.'}
          </div>
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-1 rounded-2xl text-sm font-semibold border border-zinc-300 dark:border-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Action Button */}
        <div className="flex justify-center pb-8 pt-4">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-600 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-1/4 min-w-[150px]"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}
