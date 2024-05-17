"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function SessionButton() {
	const { status } = useSession();

	const handleSignIn = () => {
		signIn("cognito");
	};
	const handleSignOut = () => {
		signOut();
	};

	if (status === "loading") {
		return <div className="mx-auto">Loading...</div>;
	}


	return (
		<button
			type="button"
			onClick={status !== "authenticated" ? handleSignIn : handleSignOut}

		>
			{status !== "authenticated" ? "ログイン" : "ログアウト"}
		</button>
	);
}
