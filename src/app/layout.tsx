import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const headingFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Northstar CRM Analytics",
  description: "Full-stack CRM analytics dashboard with role-based login and predictive insights."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-surface-950 text-slate-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}