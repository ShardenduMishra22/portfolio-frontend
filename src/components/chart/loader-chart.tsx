import { Loader2, Sparkles } from "lucide-react"

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
        <div className="relative flex flex-col items-center space-y-6 p-8 bg-card/80 backdrop-blur-sm rounded-2xl border shadow-2xl">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-secondary animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground">Fetching your latest achievements...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
