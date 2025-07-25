import { ArrowUp } from 'lucide-react'
import { Button } from '../ui/button'
import { scrollToTop, motionSafe } from './utils'

interface BackToTopButtonProps {
  isMobile: boolean
}

export const BackToTopButton = ({ isMobile }: BackToTopButtonProps) => {
  return (
    <div className="flex justify-center mb-12 mr-62">
      <Button
        onClick={scrollToTop}
        variant="outline"
        size={isMobile ? 'sm' : 'default'}
        type="button"
        aria-label="Scroll back to top"
        className="bg-background/80 backdrop-blur border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-colors h-12 px-8 group shadow-lg"
      >
        <ArrowUp className={`h-4 w-4 mr-2 group-hover:-translate-y-1 ${motionSafe}`} />
        <span>Back to Top</span>
      </Button>
    </div>
  )
}
