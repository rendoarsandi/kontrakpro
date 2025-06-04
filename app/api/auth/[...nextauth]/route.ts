import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Log env variables at module load time (BE CAREFUL WITH SECRETS IN PRODUCTION LOGS)
// This is for debugging purposes only.
// In a real production environment, avoid logging sensitive information.
// However, for Cloudflare Pages functions, console.log goes to the Worker logs.
console.log("Auth.js Env Variables at module load:", {
  GOOGLE_CLIENT_ID_EXISTS: !!process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET_EXISTS: !!process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL, // This one is safe to log
});

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Menambahkan logging untuk melihat apakah konfigurasi provider Google dimuat
      ...(console.log("GoogleProvider configured with clientId:", !!process.env.GOOGLE_CLIENT_ID, "and clientSecret:", !!process.env.GOOGLE_CLIENT_SECRET) , {})
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Auth.js signIn callback:", { user, account, profile, emailPresent: !!email, credentialsPresent: !!credentials });
      // Log spesifik untuk callback Google
      if (account?.provider === "google") {
        console.log("Auth.js Google signIn callback - Account:", account);
        console.log("Auth.js Google signIn callback - Profile:", profile);
      }
      return true; // Izinkan sign-in
    },
    async redirect({ url, baseUrl }) {
      console.log("Auth.js redirect callback:", { url, baseUrl });
      // Selalu kembali ke baseUrl setelah login/logout kecuali url adalah halaman error
      if (url.startsWith(baseUrl)) return url;
      // Jika url adalah path relatif, gabungkan dengan baseUrl
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("Auth.js jwt callback:", { token, userPresent: !!user, accountPresent: !!account, profilePresent: !!profile, isNewUser });
      if (account) { // Ini hanya berjalan pada saat sign-in awal
        token.accessToken = account.access_token;
        token.idToken = account.id_token; // Jika Anda memerlukan id_token
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token, user }) {
      // console.log("Auth.js session callback:", { session, token, userPresent: !!user }); // Bisa sangat verbose
      // Kirim properti dari token (seperti accessToken) ke sesi klien
      if (session.user && token.accessToken) {
        (session.user as any).accessToken = token.accessToken;
      }
      if (session.user && token.idToken) {
        (session.user as any).idToken = token.idToken;
      }
       if (session.user && token.provider) {
        (session.user as any).provider = token.provider;
      }
      return session;
    }
  },
  events: {
    async signIn(message) {
      console.log("Auth.js signIn event:", message);
    },
    async signOut(message) {
      console.log("Auth.js signOut event:", message);
    }
    // Tambahkan event lain jika diperlukan
  },
  debug: process.env.NODE_ENV === 'development', // Aktifkan debug log next-auth di development
  // Anda dapat menambahkan callbacks di sini jika diperlukan, misalnya untuk:
  // - Mengontrol apa yang dikembalikan dalam token JWT atau objek sesi
  // - Menangani event seperti sign-in, sign-out
  // callbacks: {
  //   async jwt({ token, account }) {
  //     // Menyimpan access_token ke dalam JWT jika ada
  //     if (account) {
  //       token.accessToken = account.access_token
  //     }
  //     return token
  //   },
  //   async session({ session, token, user }) {
  //     // Mengirim properti tambahan ke objek sesi klien
  //     // session.accessToken = token.accessToken; // Contoh
  //     return session
  //   }
  // }
}

const handler = NextAuth(authOptions);

// Untuk logging permintaan masuk tambahan jika diperlukan (lebih kompleks dan mungkin tidak diperlukan jika callbacks cukup):
// Anda bisa membuat fungsi pembungkus jika benar-benar perlu mencegat req,
// tapi untuk sebagian besar kasus, callbacks dan events di authOptions sudah cukup.
// Contoh:
// const originalHandler = NextAuth(authOptions);
// const handler = async (req: Request, context: any) => {
//   console.log(`Auth.js Handler: Received ${req.method} request for ${req.url}`);
//   if (req.url.includes("/api/auth/callback/google")) {
//     const url = new URL(req.url);
//     console.log("Auth.js Google Callback - Code:", url.searchParams.get("code") ? "Exists" : "MISSING", "State:", url.searchParams.get("state") ? "Exists" : "MISSING");
//   }
//   return originalHandler(req as any, context); // Panggil handler asli
// };


export { handler as GET, handler as POST };