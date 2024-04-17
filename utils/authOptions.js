import connectDB from '@/config/database' // Corrected import statement
import User from '@/models/User'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // Corrected function name to signIn
      try {
        // Connect to database
        await connectDB()

        // Check if user exists
        const userExists = await User.findOne({ email: profile.email })

        // If not, then add user to database
        if (!userExists) {
          // Truncate user name if too long
          const username = profile.name.slice(0, 20)

          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          })
        }
        // Return true to allow sign in
        return true
      } catch (error) {
        console.error('Error during sign in:', error)
        return false // If there's an error, prevent sign in
      }
    },
    // Modifies the session object
    async session({ session }) {
      try {
        // Get user from database
        const user = await User.findOne({ email: session.user.email })

        // Assign the user id to the session
        session.user.id = user._id.toString()

        // Return session
        return session
      } catch (error) {
        console.error('Error during session:', error)
        return session // Return session as is in case of error
      }
    },
  },
}
