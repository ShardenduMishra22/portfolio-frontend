import React, { ReactNode } from 'react'
import { auth } from "@/lib/auth";



const layout = ({children} : {children: ReactNode}) => {
  return (
    <div>
      
      {children}
    </div>
  )
}

export default layout
