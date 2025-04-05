import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import Wrapper from "@/layouts/Wrapper";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uploader",
  description: "Secure file upload and analysis system",
};

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
        <ErrorBoundary>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            limit={2}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            theme="light"
          />

          <AuthProvider>
            <Wrapper>{children}</Wrapper>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
