import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grab2GO Event Manager",
  description: "Event Manager Application for Grab2GO Partners",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/grab-it-logo.png' },
      { url: '/favicon.ico' },
    ],
    shortcut: ['/grab-it-logo.png'],
    apple: ['/grab-it-logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/grab-it-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/grab-it-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/grab-it-logo.png" />
      </head>
      <body className={`${inter.className} antialiased bg-background text-text`} suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
