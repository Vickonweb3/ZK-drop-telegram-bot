import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vick Perry POV',
  description: 'Cinematic POV entry experience'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
