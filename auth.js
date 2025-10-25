// import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// let getUserModel;

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   trustHost: true, // Safe for Vercel; remove in prod if setting AUTH_TRUST_HOST
//   providers: [
//     Credentials({
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error('Email and password required');
//         }

//         const { default: connectDB } = await import('@/lib/db');
//         await connectDB();

//         if (!getUserModel) {
//           const mod = await import('@/models/User');
//           getUserModel = mod.default;
//         }
//         const User = getUserModel();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) {
//           throw new Error('No user found with this email');
//         }

//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) {
//           throw new Error('Invalid password');
//         }

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           image: user.image,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id;
//       }
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       // Ensure redirects stay within the app
//       console.log('Redirect callback:', { url, baseUrl }); // Debug
//       return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
//     },
//   },
//   pages: {
//     signIn: '/auth/login', // Note: Changed to absolute path (was 'auth/login')
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });




















































import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
let getUserModel;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Safe for Vercel; remove in prod if setting AUTH_TRUST_HOST
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const { default: connectDB } = await import('@/lib/db');
        await connectDB();

        if (!getUserModel) {
          const mod = await import('@/models/User');
          getUserModel = mod.default;
        }
        const User = getUserModel();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Ensure redirects stay within the app
      console.log('Redirect callback:', { url, baseUrl }); // Debug
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/auth/login', // Absolute path
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `__Secure-authjs.session-token`, // Matches your secure cookie
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // HTTPS on Vercel
      },
    },
    callbackUrl: {
      name: `__Secure-authjs.callback-url`,
    },
    csrfToken: {
      name: `__Host-authjs.csrf-token`, // Host prefix for CSRF
    },
  },
});