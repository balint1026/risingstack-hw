import Navbar from './components/Navbar';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wheel of Fortune',
  description: 'A fun betting game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}