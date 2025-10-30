import type { Metadata } from "next";
import { Cinzel_Decorative, Creepster } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cinzel = Cinzel_Decorative({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const creepster = Creepster({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-creepster',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Film Lovers Are Sick People",
  description: "A Shrine to Cinema's Madness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${creepster.variable}`}>
      <body className="film-grain flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
