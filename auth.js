// import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// import connectDB from '@/lib/db';
// // Dynamic import for User
// let getUserModel;

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   trustHost: true,  // Add this to fix UntrustedHost errors (safe for dev; in prod, use AUTH_TRUST_HOST env var or specific hosts)
//   providers: [
//     Credentials({
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error('Email and password required');
//         }

//         await connectDB();
        
//         // Dynamic get model
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
//           image: user.image
//         };
//       }
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
//   },
//   pages: {
//     signIn: 'auth/login',
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });



import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
// Dynamic import for User
let getUserModel;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,  // Add this to fix UntrustedHost errors (safe for dev; in prod, use AUTH_TRUST_HOST env var or specific hosts)
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Dynamic import for connectDB here (avoids top-level Mongoose load for Edge compatibility)
        const { default: connectDB } = await import('@/lib/db');
        await connectDB();
        
        // Dynamic get model
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
          image: user.image
        };
      }
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
  },
  pages: {
    signIn: 'auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});