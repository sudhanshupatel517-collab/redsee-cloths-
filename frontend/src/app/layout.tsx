import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/components/StoreProvider";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Redsee | Futuristic Fashion",
  description: "Premium e-commerce clothing dropshipping platform.",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <AuthGuard>
              <Navbar />
              <main className="min-h-screen pt-20">
                {children}
              </main>
              <Footer />
            </AuthGuard>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
