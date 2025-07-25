export function LoadingState() {
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin animate-reverse"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-heading text-foreground">Loading Experience</h2>
          <p className="text-foreground">Fetching amazing work...</p>
        </div>
      </div>
    </div>
  )
}
