import AllOverlays from "@/app/components/AllOverlays"
import type { Metadata } from 'next'
import UserProvider from './context/user'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chat Nail',
  description: 'Chat Nail'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>


        <body>
          <AllOverlays />
          {children}
        </body>

      </UserProvider>
    </html>
  )
}
