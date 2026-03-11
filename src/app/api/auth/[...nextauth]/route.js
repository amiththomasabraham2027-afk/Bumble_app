import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import fs from "fs"
import path from "path"

function logToFile(msg) {
  try {
    const logPath = path.join(process.cwd(), 'nextauth-debug.log');
    fs.appendFileSync(logPath, new Date().toISOString() + ': ' + msg + '\n');
  } catch(e) {}
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      logToFile(`SignIn triggered for provider: ${account?.provider}. Email: ${user?.email}`);
      if (account.provider === "google") {
        try {
          await connectToDatabase();
          logToFile(`DB Connected.`);
          
          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });
          logToFile(`Existing User found? ${!!existingUser}`);
          
          if (!existingUser) {
            logToFile(`Attempting to create new user...`);
            // Create a new user if they don't exist
            // Using placeholder values for required schema fields that Google doesn't provide
            await User.create({
              email: user.email,
              name: user.name,
              firstName: profile.given_name || user.name.split(' ')[0],
              imageUrls: [user.image],
              // These are required by our schema but not provided by Google OAuth.
              // In a real app we would redirect them to an onboarding flow instead of putting placeholders.
              dob: new Date('2000-01-01'), // Placeholder
              gender: 'unspecified', // Placeholder
            });
            logToFile(`User created successfully.`);
          }
          logToFile(`SignIn returning true.`);
          return true;
        } catch (error) {
          logToFile(`ERROR in signIn: ${error.message}\n${error.stack}`);
          console.error("Error signing in with Google:", error);
          return `/login?error=${encodeURIComponent(error.message)}`;
        }
      }
      return true;
    },
    async session({ session, token }) {
      logToFile(`Session callback triggered. Current session user: ${session?.user?.email}`);
      if (session?.user) {
        try {
          await connectToDatabase();
          // Attach the MongoDB user ID / full profile to the session so the client can use it
          logToFile(`Session callback token: ${JSON.stringify(token)}`);
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.dbProfile = dbUser;
          } else {
             logToFile(`Session error: user not found in DB.`);
          }
        } catch (error) {
          logToFile(`ERROR in session: ${error.message}`);
          console.error("Error fetching user session data:", error);
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      logToFile(`JWT callback triggered. Token email: ${token?.email}. User present: ${!!user}`);
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login', // Redirect users here when login is required
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
