import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supa Blog",
  description: "A simple blog starter kit built with Supabase and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
