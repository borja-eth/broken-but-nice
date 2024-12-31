import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "../styles/globals.css";
import { Providers } from "@/components/providers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "OKR Tracker",
  description: "Sistema de gestión de OKRs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex w-full flex-col">
                <div className="flex h-14 w-full items-center border-b px-4">
                  <SidebarTrigger />
                </div>
                <div className="flex-1 overflow-auto">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
