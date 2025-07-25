import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

interface ErrorProps {
  error?: string
  onRetry?: () => void
  onGoBack?: () => void
  onGoHome?: () => void
  title?: string
  showActions?: boolean
}

const Error = ({
  error = 'Something went wrong. Please try again.',
  onRetry,
  onGoBack,
  onGoHome,
  title = 'Oops! Something went wrong',
  showActions = true,
}: ErrorProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-destructive/20 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 border border-destructive/20">
            <p className="text-foreground text-sm leading-relaxed">{error}</p>
          </div>

          {showActions && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onRetry && (
                <Button onClick={onRetry} variant="default" className="group">
                  <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                  Try Again
                </Button>
              )}

              {onGoBack && (
                <Button onClick={onGoBack} variant="outline" className="group">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Go Back
                </Button>
              )}

              {onGoHome && (
                <Button onClick={onGoHome} variant="outline" className="group">
                  <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Go Home
                </Button>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-foreground">
              If this problem persists, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Error
