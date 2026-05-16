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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0A0A0A] text-white">
        <StoreProvider>
          <AuthGuard>
            <Navbar />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
          </AuthGuard>
        </StoreProvider>
      </body>
    </html>
  );
}
