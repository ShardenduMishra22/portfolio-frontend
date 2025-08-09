'use client'

import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636L5.636 18.364m0-12.728L18.364 18.364M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            It looks like you&apos;re not connected to the internet. Don&apos;t worry, you can still browse some cached content.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Go to Homepage
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Try these when you&apos;re back online:</p>
            <div className="mt-2 space-x-4">
              <Link href="/projects" className="hover:underline">
                Projects
              </Link>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
              <Link href="/experiences" className="hover:underline">
                Experience
              </Link>
              <Link href="/certifications" className="hover:underline">
                Certifications
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            About Shardendu Mishra
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Software Developer and Engineer passionate about building impactful applications 
            with modern technologies. Specializing in Go, React, and cloud-native solutions.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
        >
          Try to reconnect
        </button>
      </div>
    </div>
  )
}
