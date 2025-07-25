import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollText } from 'lucide-react'
import { Experience } from '@/data/types.data'

interface ExperienceDescriptionProps {
  experience: Experience
}

export function ExperienceDescription({ experience }: ExperienceDescriptionProps) {
  const isShortDescription = (experience?.description?.length || 0) < 500

  return (
    <Card className="border border-border/50 bg-card/50 shadow-sm">
      <CardContent
        className={`${isShortDescription ? 'min-h-[400px]' : 'min-h-[600px]'} flex flex-col relative overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_theme(colors.primary)_1px,_transparent_1px)] bg-[length:32px_32px]" />

        <div className="flex-grow relative z-10">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                // Enhanced Headings
                h1: ({ children }) => (
                  <div className="mb-8 mt-0">
                    <h1 className="text-3xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                      {children}
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                  </div>
                ),
                h2: ({ children }) => (
                  <div className="mb-6 mt-8">
                    <h2 className="text-2xl font-semibold text-foreground mb-3 tracking-tight flex items-center gap-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
                      {children}
                    </h2>
                  </div>
                ),
                h3: ({ children }) => (
                  <div className="mb-4 mt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight flex items-center gap-2">
                      <div className="w-1 h-5 bg-primary/70 rounded-full" />
                      {children}
                    </h3>
                  </div>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg font-semibold text-foreground mb-3 mt-5 tracking-tight">
                    {children}
                  </h4>
                ),
                // Enhanced Paragraphs
                p: ({ children }) => (
                  <p className="mb-5 text-lg text-foreground/90 leading-relaxed">{children}</p>
                ),
                // Custom Lists with Better Styling
                ul: ({ children }) => <ul className="mb-6 space-y-3 list-none pl-0">{children}</ul>,
                ol: ({ children }) => (
                  <ol
                    className="mb-6 space-y-3 list-none pl-0 counter-reset-list"
                    style={{ counterReset: 'list-counter' }}
                  >
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-4 text-lg text-foreground/90 leading-relaxed pl-2">
                    <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-br from-primary to-primary/70 rounded-full mt-2.5 shadow-sm" />
                    <div className="flex-1 min-w-0">{children}</div>
                  </li>
                ),
                // Enhanced Code Blocks
                code: ({ children, className, ...props }) => {
                  const isInline = !className || !className.startsWith('language-')
                  if (isInline) {
                    return (
                      <code
                        className="bg-primary/10 text-primary px-2 py-1 rounded-md text-base font-mono border border-primary/20 shadow-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className="font-mono text-base" {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <div className="mb-6 relative">
                    <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                    <div className="absolute top-3 right-8 w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                    <div className="absolute top-3 right-13 w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    <pre className="bg-muted/80 p-6 pt-10 rounded-xl overflow-x-auto border border-border/50 shadow-inner font-mono text-base">
                      {children}
                    </pre>
                  </div>
                ),
                // Enhanced Blockquotes
                blockquote: ({ children }) => (
                  <div className="mb-6 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/70 to-primary/30 rounded-full" />
                    <blockquote className="pl-6 py-4 italic text-lg text-foreground/80 bg-muted/30 rounded-r-lg border-y border-r border-border/30">
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 text-primary/30 text-4xl font-serif">
                          &quot;
                        </div>
                        <div className="pt-4">{children}</div>
                      </div>
                    </blockquote>
                  </div>
                ),
                // Enhanced Links
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    className="text-primary hover:text-primary/80 font-medium relative inline-block transition-all duration-200 hover:scale-105"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    {...props}
                  >
                    <span className="relative z-10">{children}</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/30 to-primary/60 scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </a>
                ),
                // Enhanced Strong and Emphasis
                strong: ({ children }) => (
                  <strong className="font-bold text-foreground bg-primary/10 px-1.5 py-0.5 rounded-md border border-primary/20">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-primary font-medium bg-primary/5 px-1 py-0.5 rounded">
                    {children}
                  </em>
                ),
                // Enhanced Horizontal Rules
                hr: () => (
                  <div className="my-8 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-gradient-to-r from-transparent to-border w-24" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full" />
                      <div className="h-px bg-gradient-to-l from-transparent to-border w-24" />
                    </div>
                  </div>
                ),
                // Enhanced Tables
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6 rounded-lg border border-border/50 shadow-sm">
                    <table className="w-full border-collapse bg-card/50">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border/50 bg-muted/50 px-4 py-3 text-left font-semibold text-foreground text-base">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border/50 px-4 py-3 text-foreground/90 text-base">
                    {children}
                  </td>
                ),
              }}
            >
              {experience.description}
            </ReactMarkdown>
          </div>
        </div>

        {/* Enhanced Short Description Section */}
        {isShortDescription && (
          <div className="mt-auto pt-8 space-y-6 relative z-10">
            {/* Professional Separator */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-6">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-20" />
                <div className="relative">
                  <div className="p-2 bg-background/90 backdrop-blur-sm rounded-full border border-border/50 shadow-sm">
                    <ScrollText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                </div>
                <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent w-20" />
              </div>
            </div>

            {/* Enhanced Quick Facts */}
            <div className="relative">
              <div className="bg-gradient-to-br from-muted/40 to-muted/20 backdrop-blur-sm rounded-xl p-6 border border-border/30 shadow-sm">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Experience Quick Facts
                  </h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60 rounded-lg" />
                    <div className="relative p-4 text-center backdrop-blur-sm rounded-lg border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {experience.technologies.length}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Technologies</div>
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full mt-2" />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60 rounded-lg" />
                    <div className="relative p-4 text-center backdrop-blur-sm rounded-lg border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {experience.projects.length}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Projects</div>
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
