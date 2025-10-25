import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오목",
  description: "친구들과 같이 오목을 해봐요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="ko">
      <body className="h-full">{children}</body>
    </html>
  );
}
