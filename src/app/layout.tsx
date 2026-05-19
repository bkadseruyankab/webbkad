import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BKAD Kabupaten Seruyan - Badan Keuangan dan Aset Daerah",
  description:
    "Portal resmi Badan Keuangan dan Aset Daerah Kabupaten Seruyan, Kalimantan Tengah - Informasi terkini, layanan publik, dan transparansi keuangan daerah.",
  keywords: [
    "BKAD",
    "Seruyan",
    "Keuangan Daerah",
    "Aset Daerah",
    "Kabupaten Seruyan",
    "Kalimantan Tengah",
    "Pemerintah Daerah",
  ],
  authors: [{ name: "BKAD Kabupaten Seruyan" }],
  icons: {
    icon: "/images/favicon.ico",
  },
  openGraph: {
    title: "BKAD Kabupaten Seruyan",
    description:
      "Portal resmi Badan Keuangan dan Aset Daerah Kabupaten Seruyan",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
