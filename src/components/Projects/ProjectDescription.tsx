import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProjectDescriptionProps {
  description: string;
  showCard?: boolean;
  className?: string;
}

export function ProjectDescription({ 
  description, 
  showCard = true,
  className
}: ProjectDescriptionProps) {
  const markdownComponents = useMemo(() => ({
    // Simple, clean headings
    h1: ({ children, className: _className, ...props }: any) => (
      <h1 
        className={cn("text-3xl font-bold mb-4 text-foreground", _className)}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, className: _className, ...props }: any) => (
      <h2 
        className={cn("text-2xl font-semibold mb-3 mt-6 text-foreground", _className)}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, className: _className, ...props }: any) => (
      <h3 
        className={cn("text-xl font-semibold mb-2 mt-4 text-foreground", _className)}
        {...props}
      >
        {children}
      </h3>
    ),

    // Clean paragraphs
    p: ({ children, className: _className, ...props }: any) => (
      <p 
        className={cn("mb-4 text-foreground/90 leading-relaxed", _className)}
        {...props}
      >
        {children}
      </p>
    ),

    // Simple lists
    ul: ({ children, className: _className, ...props }: any) => (
      <ul className={cn("list-disc pl-6 mb-4 space-y-1", _className)} {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, className: _className, ...props }: any) => (
      <ol className={cn("list-decimal pl-6 mb-4 space-y-1", _className)} {...props}>
        {children}
      </ol>
    ),
    li: ({ children, className: _className, ...props }: any) => (
      <li className={cn("text-foreground/90", _className)} {...props}>
        {children}
      </li>
    ),

    // Code styling
    code: ({ children, className: _className, inline, ...props }: any) => {
      if (inline) {
        return (
          <code 
            className={cn("bg-muted px-2 py-1 rounded text-sm font-mono", _className)}
            {...props}
          >
            {children}
          </code>
        );
      }
      return <code className={cn("font-mono text-sm", _className)} {...props}>{children}</code>;
    },
    pre: ({ children, className: _className, ...props }: any) => (
      <pre 
        className={cn("bg-muted p-4 rounded-lg overflow-x-auto mb-4", _className)}
        {...props}
      >
        {children}
      </pre>
    ),

    // Simple blockquotes
    blockquote: ({ children, className: _className, ...props }: any) => (
      <blockquote 
        className={cn("border-l-4 border-border pl-4 italic mb-4", _className)}
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Clean images
    img: ({ src, alt, className: _className, ...props }: any) => {
      const imgSrc = typeof src === 'string' ? src : '';
      if (!imgSrc) return null;
      
      return (
        <Image 
          src={imgSrc}
          alt={alt || 'Project image'}
          width={600}
          height={400}
          className={cn("w-full rounded-lg mb-4", _className)}
          {...props}
        />
      );
    },
  }), []);

  // Smart content splitting that ensures right half starts with a heading
  const splitDescription = () => {
    const lines = description.split('\n');
    const totalLines = lines.length;
    const halfIndex = Math.floor(totalLines / 2);

    // Look for the next heading starting from halfway point
    for (let i = halfIndex; i < totalLines; i++) {
      const line = lines[i].trim();
      // Check if line starts with # (any level heading)
      if (line.startsWith('#')) {
        const leftContent = lines.slice(0, i).join('\n');
        const rightContent = lines.slice(i).join('\n');
        return { leftContent, rightContent };
      }
    }

    // If no heading found after halfway, fallback to original split
    const leftContent = lines.slice(0, halfIndex).join('\n');
    const rightContent = lines.slice(halfIndex).join('\n');
    return { leftContent, rightContent };
  };

  const { leftContent, rightContent } = splitDescription();

  const content = (
    <div className="grid md:grid-cols-2 gap-8 h-full">
      {/* Left Half */}
      <div className="space-y-4">
        <div className={cn("prose max-w-none dark:prose-invert", className)}>
          <ReactMarkdown components={markdownComponents}>
            {leftContent || 'No description available.'}
          </ReactMarkdown>
        </div>
      </div>

      {/* Right Half - Always starts with a heading */}
      <div className="space-y-4">
        <div className={cn("prose max-w-none dark:prose-invert", className)}>
          <ReactMarkdown components={markdownComponents}>
            {rightContent || ''}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );

  if (!showCard) {
    return (
      <div className="w-full min-h-[50vh]">
        {content}
      </div>
    );
  }

  return (
    <CardContent className="min-h-[50vh]">
      {content}
    </CardContent>
  );
}
