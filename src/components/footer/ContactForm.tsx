import { Mail, Send } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useContactForm } from './hooks/useContactForm'

export const ContactForm = () => {
  const {
    formData,
    isSubmitting,
    submitStatus,
    handleInputChange,
    handleSubmit,
  } = useContactForm()

  return (
    <div className="lg:col-span-1 flex flex-col h-full ">  
      <div
        className="
          relative flex flex-col flex-1      /* full height card */
          bg-gradient-to-br from-background/60 via-card/30 to-card/10
          border border-border/40 rounded-2xl backdrop-blur-lg
          p-8 shadow-lg transition-all duration-300
        "
      >
        {/* top accent */}
        <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-gradient-to-r from-primary via-secondary to-primary" />

        {/* header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/90 shadow-inner">
            <Mail className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Let’s Talk
          </h3>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col flex-1 space-y-6">
          {/* name + email */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="h-12 rounded-lg bg-background/80 border border-border/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="h-12 rounded-lg bg-background/80 border border-border/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* message */}
          <textarea
            name="message"
            rows={5}
            placeholder="Share details or say hello…"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="min-h-[120px] w-full resize-none rounded-lg bg-background/80 border border-border/50 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/40"
          />

          {/* status */}
          {submitStatus === 'success' && (
            <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-600">
              Message sent! I’ll respond soon.
            </p>
          )}
          {submitStatus === 'error' && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              Please complete every field correctly.
            </p>
          )}

          {/* button pinned to bottom */}
          <div className="mt-auto">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold shadow-md hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeDasharray="60" strokeWidth="3" />
                  </svg>
                  Sending…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send message
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
