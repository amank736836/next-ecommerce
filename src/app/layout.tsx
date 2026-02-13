import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/app.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VirtuoStore - Premium E-commerce",
  description: "Shop the best products at VirtuoStore. Quality, Speed, and Trust.",
  icons: {
    icon: "/icon.svg",
  },
};

import ReduxProvider from "@/components/ReduxProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
