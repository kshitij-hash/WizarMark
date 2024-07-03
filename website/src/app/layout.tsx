import type { Metadata } from "next";
import { Stylish } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const stylish = Stylish({
  subsets: ['latin'],
  style: 'normal',
  weight: '400',
});

export const metadata: Metadata = {
  title: "wizarmark",
  description: "a browser extension for managing bookmarks with AI-driven categorization and easy-to-use search functionality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={stylish.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
