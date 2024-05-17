import type { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	debug: true,
	providers: [
		CognitoProvider({
			clientId: process.env.COGNITO_CLIENT_ID || "",
			clientSecret: process.env.COGNITO_CLIENT_SECRET || "",
			issuer: process.env.COGNITO_ISSUER,
			checks: "nonce",
			idToken: true,
			authorization: {
				params: {
					response_type: "code",
					scope: "openid profile email",
				},
			},
		}),
	],

	callbacks: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async jwt({ token, user, account, profile }: any) {
			if (account) {
				token.id = user.id;
			}
			if (profile) {
				token.name = profile.name;
				token.sub = profile.sub;
				token.picture = profile.picture;
			}
			return token;
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async session({ session, token }: any) {
			session.user.email = token.email;
			session.user.name = token.name;
			session.user.image = token.picture;
			return session;
		},
	},
};
