import type { Metadata } from "next";
import { Nanum_Myeongjo, Playfair_Display } from "next/font/google";
import "./globals.css";

const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Tag Fortune",
  description: "Your daily fortune",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${nanumMyeongjo.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
