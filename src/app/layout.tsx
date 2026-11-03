import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { KWT_INFO } from '@/lib/constants';
import { getStorePayload } from '@/lib/data-service';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${KWT_INFO.shortName} ${KWT_INFO.village} — Katalog Olahan Hasil Tani`,
  description:
    'Etalase digital resmi Kelompok Wanita Tani (KWT) Lestari Desa Sumber Makmur, Kec. Mentaya Hilir Utara, Kabupaten Kotawaringin Timur. Pesan keripik, sambal, dan olahan tani alami langsung via WhatsApp.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = await getStorePayload();

  return (
    <html lang="id" className={jakarta.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <CartProvider initialSettings={settings}>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
