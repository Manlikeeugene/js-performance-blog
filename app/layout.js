import Providers from './components/Providers'; // Adjust path to your new file
import { Toaster } from 'react-hot-toast';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}