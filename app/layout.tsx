import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - faaz.dev",
    default: "faaz.dev",
  },
  description:
    "I'm a self-taught full-stack developer, who loves tinkering with stuff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
