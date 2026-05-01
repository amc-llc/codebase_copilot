import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "codebase analysis",
    "AI code review",
    "documentation generator",
    "test generator",
    "code refactoring",
    "IBM watsonx",
    "OpenAI",
    "Anthropic Claude",
  ],
  authors: [{ name: "Codebase Copilot Team" }],
  creator: "Codebase Copilot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codebase-copilot.com",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

// Made with Bob
