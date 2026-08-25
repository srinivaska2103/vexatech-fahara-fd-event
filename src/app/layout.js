import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fahara Event Manager",
  description: "Event Manager Application for Fahara Partners",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/fahara-logo.jpeg' },
      { url: '/favicon.ico' },
    ],
    shortcut: ['/fahara-logo.jpeg'],
    apple: ['/fahara-logo.jpeg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/fahara-logo.jpeg" type="image/jpeg" />
        <link rel="shortcut icon" href="/fahara-logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/fahara-logo.jpeg" />
      </head>
      <body className={`${inter.className} antialiased bg-background text-text`} suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
