import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
// <CHANGE> Import GameProvider for global state management
import { GameProvider } from "@/lib/game-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// <CHANGE> Updated metadata for spy mission theme
export const metadata: Metadata = {
  title: "OPERATION: NIGHTFALL - Spy Escape Mission",
  description: "Immersive spy-themed escape room experience",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* <CHANGE> Added font-mono class for hacker aesthetic */}
      <body className={`font-sans antialiased`}>
        {/* <CHANGE> Wrap app with GameProvider */}
        <GameProvider>{children}</GameProvider>
        <Analytics />
      </body>
    </html>
  )
}
