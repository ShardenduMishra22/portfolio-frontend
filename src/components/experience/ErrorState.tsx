import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Zap } from 'lucide-react'

interface ErrorStateProps {
  error?: string
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Experience Not Found</h2>
            <p className="text-foreground max-w-md">
              {error || "The experience you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/experiences">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experiences
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
