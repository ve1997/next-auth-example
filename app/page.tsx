import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { SessionButton } from "@/app/components/SessionButton";
import { getServerSession } from "next-auth/next";

export default async function Home() {
	const session = await getServerSession(authOptions);
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col rounded-md bg-neutral-100">
					<SessionButton />
					<div className="rounded-t-md bg-neutral-200 p-4 text-center font-bold">
						Current Session
					</div>
					<pre className="whitespace-pre-wrap break-all px-4 py-6">
						{JSON.stringify(session, null, 2)}
					</pre>
				</div>
			</div>
		</main>
	);
}
