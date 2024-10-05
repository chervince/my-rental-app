//app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Rental App',
  description: 'Application de location de parcelles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Navigation />
          <main className="container mx-auto mt-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}