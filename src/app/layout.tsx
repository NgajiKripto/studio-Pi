import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zepret | The Holographic Curator',
  description: 'Ubah momen biasa jadi karya seni holographic 3D. Bukan sekedar foto, tapi dimensi baru gaya lo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body">
        {children}
      </body>
    </html>
  );
}
