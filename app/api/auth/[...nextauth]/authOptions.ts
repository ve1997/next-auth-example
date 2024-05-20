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
		redirect({ url, baseUrl }) {
			// OAuthプロバイダ（Cognito）からサインアウト
			// signOut({ callbackUrl: "signOut" }) を呼び出すとこのコールバックが呼ばれる
			// https://github.com/nextauthjs/next-auth/discussions/3938#discussioncomment-2231398
			if (url.startsWith(baseUrl)) return url;
			if (url === "signout" && process.env.COGNITO_LOGOUT_ENDPOINT_URL) {
				// OAuthプロバイダ（Cognito）からサインアウト
				const logoutEndpointUrl = process.env.COGNITO_LOGOUT_ENDPOINT_URL || "";
				const params = new URLSearchParams({
					client_id: process.env.COGNITO_CLIENT_ID || "",
					redirect_uri: `${process.env.NEXTAUTH_URL}/`,
					response_type: "code",
				});
				return `${logoutEndpointUrl}?${params.toString()}`;
			}
			// 相対コールバックURLを許可する
			if (url.startsWith("/")) return new URL(url, baseUrl).toString();
			// リダイレクトURLが外部ドメインの場合、ルートにリダイレクトする
			return baseUrl;
		},
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
