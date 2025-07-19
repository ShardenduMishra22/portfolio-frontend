'use client'
import { authClient } from "@/lib/authClient";
import { BookOpen, Sparkles, ArrowRight, Quote } from "lucide-react";

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Welcome to Your Blog
          </h1>
          
          <p className="text-foreground text-lg font-subheading">
            Share your thoughts and inspire others
          </p>
        </div>

        {/* Inspirational Quote */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Quote className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
            <div>
              <p className="text-card-foreground/80 italic text-sm leading-relaxed">
                &#34;The best way to find out if you can trust somebody is to trust them.&#34;
              </p>
              <p className="text-accent text-xs mt-2 font-medium">— Ernest Hemingway</p>
            </div>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 text-primary mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Get Started</span>
            </div>
            <p className="text-card-foreground/70 text-sm">
              Begin your blogging journey with a single click
            </p>
          </div>

          <button
            onClick={() => authClient.signIn.social({
              provider: 'google',
              callbackURL: '/blog/landing',
              errorCallbackURL: '/not-found',
            })}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-foreground">
              By continuing, you agree to our terms and privacy policy
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-foreground text-sm">
            Ready to share your unique perspective with the world?
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
