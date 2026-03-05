import type { Metadata } from "next";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard | BCI Company",
  description: "Management portal for BCI Company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kanit.variable} antialiased`}
      >
        <AuthProvider>
          <AdminLayoutWrapper>
            {children}
          </AdminLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
