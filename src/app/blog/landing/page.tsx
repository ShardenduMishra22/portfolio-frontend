import { authClient } from '@/lib/authClient'
import React from 'react'

const page = () => {
  const session = authClient.useSession();

  return (
    <div>
      {session ? (
        <p>Welcome back, {session.data?.user.name}!</p>
      ) : (
        <p>Please log in to access your blog.</p>
      )}
    </div>
  )
}

export default page
