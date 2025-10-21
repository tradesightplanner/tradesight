// app/layout.tsx
import '../styles/globals.css';
import Header from '../components/Header';

export const metadata = { title: 'TradeSight' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-gray-200">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
