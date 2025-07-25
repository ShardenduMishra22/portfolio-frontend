'use client';

import { 
  Copy, 
  Check, 
  Code2, 
  Quote,
  Lightbulb,
  ScrollText, 
  ExternalLink, 
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import NextLink from 'next/link';
import remarkGfm from 'remark-gfm';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SkillsLens } from '../ui/skill-lens';
import { Button } from '@/components/ui/button';
import { Certification } from '@/data/types.data';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CertificationDetailsProps {
  certification: Certification;
}

// Enhanced Code Block Component
const CodeBlock = ({ language, children }: { language: string; children: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">
            {language || 'code'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

// Enhanced Blockquote Component
const CustomBlockquote = ({ children }: { children: React.ReactNode }) => (
    <div>
      <Quote className="absolute top-4 left-4 w-5 h-5 text-primary/60" />
      <div className="pl-8">
        {children}
      </div>
    </div>
);

// Enhanced Link Component
const CustomLink = ({ href, children }: { href?: string; children: React.ReactNode }) => (
  <NextLink
    href={href ?? '#'}
    target={href?.startsWith('http') ? '_blank' : undefined}
    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors"
  >
    {children}
    {href?.startsWith('http') && <LinkIcon className="w-3 h-3" />}
  </NextLink>
);

// Enhanced Image Component
const CustomImage = ({ src, alt }: { src?: string; alt?: string }) => (
  <div
    className="my-6 rounded-lg overflow-hidden border border-border/50 bg-card/50"
  >
    {src ? (
      <Image
        src={src}
        alt={alt ?? ''}
        width={800}
        height={400}
        className="w-full h-auto"
        loading="lazy"
      />
    ) : null}
    {alt && (
      <div className="p-3 bg-muted/30 text-sm text-muted-foreground text-center">
        <ImageIcon className="w-4 h-4 inline mr-2" />
        {alt}
      </div>
    )}
  </div>
);

// Enhanced List Component
const CustomList = ({ ordered, children }: { ordered?: boolean; children: React.ReactNode }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`space-y-2 my-4 ${ordered ? 'list-decimal' : 'list-none'} pl-6`}>
      {children}
    </Tag>
  );
};

const CustomListItem = ({ children }: { children: React.ReactNode }) => (
  <li
    className="relative flex items-start gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors"
  >
    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
    <div className="flex-1">{children}</div>
  </li>
);

// Reading Time Calculator
const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Custom Heading Component
const CustomHeading = ({ level, children }: { level: number; children: React.ReactNode }) => {
  const sizes = {
    1: 'text-3xl font-bold mb-6 mt-8',
    2: 'text-2xl font-semibold mb-4 mt-6',
    3: 'text-xl font-semibold mb-3 mt-5',
    4: 'text-lg font-medium mb-2 mt-4',
    5: 'text-base font-medium mb-2 mt-3',
    6: 'text-sm font-medium mb-2 mt-2',
  };

  return (
    <div
      className="relative"
    >
      <div className={`${sizes[level as keyof typeof sizes]} text-foreground relative z-10`}>
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          {children}
        </div>
      </div>
    </div>
  );
};

export const CertificationDetails: React.FC<CertificationDetailsProps> = ({ certification }) => {
  const [copied, setCopied] = useState(false);
  const isShortDescription = (certification?.description?.length || 0) < 500;

  const customRenderers = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && match ? (
        <CodeBlock language={language}>
          {String(children).replace(/\n$/, '')}
        </CodeBlock>
      ) : (
        <code 
          className="px-2 py-1 bg-muted rounded text-sm font-mono border" 
          {...props}
        >
          {children}
        </code>
      );
    },
    blockquote: ({ children }: any) => <CustomBlockquote>{children}</CustomBlockquote>,
    a: ({ href, children }: any) => <CustomLink href={href}>{children}</CustomLink>,
    img: ({ src, alt }: any) => <CustomImage src={src} alt={alt} />,
    ul: ({ children }: any) => <CustomList>{children}</CustomList>,
    ol: ({ ordered, children }: any) => <CustomList ordered={ordered}>{children}</CustomList>,
    li: ({ children }: any) => <CustomListItem>{children}</CustomListItem>,
    h1: ({ children }: any) => <CustomHeading level={1}>{children}</CustomHeading>,
    h2: ({ children }: any) => <CustomHeading level={2}>{children}</CustomHeading>,
    h3: ({ children }: any) => <CustomHeading level={3}>{children}</CustomHeading>,
    h4: ({ children }: any) => <CustomHeading level={4}>{children}</CustomHeading>,
    h5: ({ children }: any) => <CustomHeading level={5}>{children}</CustomHeading>,
    h6: ({ children }: any) => <CustomHeading level={6}>{children}</CustomHeading>,
    p: ({ children }: any) => (
      <p
        className="mb-4 leading-relaxed text-foreground"
      >
        {children}
      </p>
    ),
  };

  return (
    <>
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className={`${isShortDescription ? 'min-h-[400px]' : 'min-h-[600px]'} flex flex-col`}>
          <div className="flex-grow">
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={customRenderers}
              >
                {certification.description}
              </ReactMarkdown>
            </div>
          </div>

          {certification.certificate_url && (
            
            <div 
              className="mt-8"
            >
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-emerald-50/50 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-emerald-950/30 p-6 border border-border/40">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  {/* Footer with Left-Center-Right Distribution */}
                  <div className="flex items-center justify-between gap-4">
                    
                    {/* Left Section - Certificate Status */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Certificate Verified
                      </span>
                    </div>

                    {/* Center Section - Title and Description */}
                    <div className="flex-1 text-center">
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        Official Certification
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        View and verify this certification credential
                      </p>
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex gap-3">
                      <a
                        href={certification.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md group"
                      >
                        <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        View Certificate
                        <div
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                          →
                        </div>
                      </a>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(certification.certificate_url);
                            setCopied(true);
                            // Reset after 2 seconds
                            setTimeout(() => setCopied(false), 2000);
                          } catch (err) {
                            console.error('Failed to copy URL:', err);
                          }
                        }}
                        className={`inline-flex items-center gap-2 transition-all duration-300 ${
                          copied 
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' 
                            : 'bg-background/80 hover:bg-background'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </>
                        )}
                      </Button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {isShortDescription && (
            <div className="mt-auto pt-8 space-y-6"
            >
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="h-px bg-border flex-1 max-w-20" />
                  <ScrollText className="w-4 h-4" />
                  <div className="h-px bg-border flex-1 max-w-20" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20 rounded-lg p-6 space-y-4 border border-border/30">
                <h3 className="text-lg font-semibold text-foreground mb-4 text-center flex items-center justify-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Certification Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div 
                    className="text-center p-4 bg-background/50 rounded-lg border border-border/20 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-2xl text-primary mb-1">{certification.skills.length}</div>
                    <div className="text-muted-foreground font-medium">Skills Gained</div>
                  </div>
                  <div
                    className="text-center p-4 bg-background/50 rounded-lg border border-border/20 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-2xl text-primary mb-1">{certification.projects?.length || 0}</div>
                    <div className="text-muted-foreground font-medium">Projects Built</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Section with Enhanced Display */}
      <div>
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-1 h-5 bg-primary rounded-full" />
              Skills & Competencies
            </CardTitle>
            <CardDescription>Technical skills gained through this certification journey</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillsLens skills={certification.skills} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
