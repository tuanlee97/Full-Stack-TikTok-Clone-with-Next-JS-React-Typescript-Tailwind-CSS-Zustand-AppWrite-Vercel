import AllOverlays from "@/app/components/AllOverlays";
import type { Metadata } from 'next';
import UserProvider from './context/user';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChatNail - Nail Art, Tutorials, & Trends for Beautiful Nails',
  description: 'ChatNail is your ultimate nail community with trendy nail art designs, tutorials, care tips, and product recommendations to keep your nails beautiful and healthy.',
  keywords: 'nail art, manicure, pedicure, nail designs, nail tutorials, nail care, ChatNail, nail salon tips',
  robots: 'index, follow', // Chỉ thị cho công cụ tìm kiếm
  openGraph: {
    title: 'ChatNail - Nail Art, Tutorials, & Trends for Beautiful Nails',
    description: 'Join ChatNail for the latest in nail art, tutorials, trends, and tips for beautiful nails.',
    url: 'https://chatnail.com', // URL trang web của bạn
    type: 'website',
    images: `${process.env.NEXT_PUBLIC_BASE_URL}/images/n360-card-bg-img.webp`, // Thay bằng URL hình ảnh thumbnail
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatNail - Nail Art, Tutorials, & Trends for Beautiful Nails',
    description: 'Join ChatNail for the latest in nail art, tutorials, trends, and tips for beautiful nails.',
    images: `${process.env.NEXT_PUBLIC_BASE_URL}/images/n360-card-bg-img.webp`, // Thay bằng URL hình ảnh thumbnail Twitter
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>


        <body>
          <AllOverlays />
          {children}
        </body>

      </UserProvider>
    </html>
  )
}
