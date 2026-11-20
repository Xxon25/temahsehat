import "./globals.css";

export const metadata = {
  title: "TemanSehat — Platform Edukasi Pertemanan Remaja & Bimbingan Konseling Digital",
  description:
    "Platform edukasi psikoedukasi pertemanan sehat remaja SMA/SMK dan sistem informasi pelayanan Bimbingan Konseling (BK) terintegrasi Supabase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800">
        {children}
      </body>
    </html>
  );
}
