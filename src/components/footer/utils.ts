// Utility for motion-safe transitions
export const motionSafe = 'motion-safe:transition-all motion-safe:duration-300'

// Scroll to top utility
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
