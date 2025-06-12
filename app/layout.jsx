import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'EHB Technologies',
  description: 'Your all-in-one platform for services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-50 text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
