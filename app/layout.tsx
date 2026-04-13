import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASE TECH — Apple Reconditionné Premium",
  description:
    "Appareils Apple reconditionnés avec soin. Qualité premium, prix accessible. Garantie 24 mois.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
