import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Poppins } from "next/font/google";
import { Ga_Maamli } from "next/font/google";
import { Inter } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-google-poppins",
  display: "swap",
});

const gaMaamli = Ga_Maamli({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-google-ga-maamli",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-google-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Armando Paredes",
  description: "Desarrolladora inmobiliaria en Lima.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${poppins.variable} ${gaMaamli.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
