import { withAuth } from "next-auth/middleware";

export default withAuth({
	pages: {
		// matcherで指定したページにアクセスした場合（sessionがない場合）にリダイレクトするページ
		signIn: "/login",
		// routerでエラー発生した場合にリダイレクトするページ, callbackの処理でエラーが落ちた場合など
		error: "/error",
	},
});

export const config = {
	matcher: ["/", "/((?!non-protected).*)"],
};
