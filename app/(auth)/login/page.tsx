"use client";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
	const { status } = useSession();

	if (status === "loading") {
		return <Loader />;
	}
	if (status !== "authenticated") {
		signIn("cognito");
		return <Loader />;
	}
	location.href = "/";

	// location.hrefでgetリクエストを送信中に、ローディング画面を表示する
	return <Loader />;
}

function Loader() {
	return (
		<div
			className="flex h-screen items-center justify-center"
			aria-label="読み込み中"
		>
			<div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
		</div>
	);
}
