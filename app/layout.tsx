import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/contexts/WalletContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { LoadingWrapper } from '@/components/LoadingWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'World Citizenship NFT - Universal Passport',
  description: 'Universal identity NFT on Stacks blockchain',
  keywords: ['NFT', 'Stacks', 'Blockchain', 'World Citizenship', 'Universal Passport'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <WalletProvider>
            <LoadingWrapper>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                {children}
              </div>
            </LoadingWrapper>
          </WalletProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
