import type { Metadata } from "next";
import { Poppins, Viga } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const viga = Viga({
  variable: "--font-viga",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Job Board Frontend",
  description: "Plateforme de gestion des offres et candidatures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${viga.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
