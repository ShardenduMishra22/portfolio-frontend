'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation';
import React from 'react'

const Page = () => {
  const session = authClient.useSession();
  const router = useRouter();

  return (
    <div>
      {session ? (
        <><p>Welcome back </p><button onClick={() => authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/blog");
            },
          },
        })}>Sign Out</button></>
      ) : (
        <p>Please log in to access your blog.</p>
      )}
    </div>
  )
}

export default Page
