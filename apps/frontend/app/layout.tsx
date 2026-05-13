import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ConfigProvider, theme } from "antd";
import Providers from "@/components/Provider";
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Chat App",
  description:
    "A real-time chat application built with Next.js, Express, and Socket.IO. Connect with friends and family instantly with our user-friendly interface and seamless communication features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} h-full antialiased bg-gray-200`}
    >
      <body className="min-h-full flex flex-col">
        <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
          <Providers>{children}</Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
