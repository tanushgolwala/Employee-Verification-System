import type { Metadata } from "next";
import { Inter as FontSans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils"


// const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto_Mono({ subsets: ["latin"], weight: ["400"] });

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Employee Verification System",
  description: "A system for excel validation and upload for employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
