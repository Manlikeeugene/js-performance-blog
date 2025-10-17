// import { SessionProvider } from 'next-auth/react';
// import './globals.css';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <SessionProvider>{children}</SessionProvider>
//       </body>
//     </html>
//   );
// }

// import LoadingProvider from './components/LoadingProvider'; // Adjust path
// import { SessionProvider } from 'next-auth/react';
// import './globals.css';


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <LoadingProvider>
//           {children}
//         </LoadingProvider>
//       </body>
//     </html>
//   );
// }

import { SessionProvider } from 'next-auth/react'; // Add this
import LoadingProvider from './components/LoadingProvider'; // Your global loader
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider> {{refetchOnWindowFocus: true}}
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </SessionProvider>
      </body>
    </html>
  );
}