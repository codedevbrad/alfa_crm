import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "../lib/auth/auth.provider"

import { ThemeProvider } from "./themeProvider"
import BootcampSettings from "./components/settings"
import "./globals.css"
import LoadingBar from "@/components/app/loading/loadingBar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALFA CRM",
  description: "ALFA CRM Platform",
};


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
           <ThemeProvider>
              <LoadingBar />
                  <div className="flex-grow flex flex-col">
                      {children}
                  </div>
              <BootcampSettings />
           </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}