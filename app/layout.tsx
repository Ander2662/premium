import type {Metadata, Viewport} from 'next'
import {Lato, Playfair_Display} from 'next/font/google'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--font-lato',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata:Metadata = {
  title: "Nuestro Crucero Mediterráneo",
  description: "8–15 agosto 2026",
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Crucero Premium',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport:Viewport = {
  themeColor: '#081120',
}

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="Crucero Premium"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <link rel="icon" href="/icons/icon.png" type="image/png"/>
        <link rel="apple-touch-icon" href="/icons/icon.png"/>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html,body{width:100%;height:100%;overflow:hidden;background:#081120}
          body{font-family:var(--font-lato),sans-serif;color:white}
          h1,h2,h3{font-family:var(--font-playfair),serif}
          button{font-family:var(--font-lato),sans-serif}
          ::-webkit-scrollbar{width:6px}
          ::-webkit-scrollbar-track{background:rgba(255,255,255,0.05)}
          ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:3px}
        `}</style>
      </head>
      <body className={`${lato.variable} ${playfair.variable}`}>{children}</body>
    </html>
  )
}