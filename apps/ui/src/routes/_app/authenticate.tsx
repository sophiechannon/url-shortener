import { Show } from "@clerk/react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { AuthTabs } from "@/features/auth";

export const Route = createFileRoute("/_app/authenticate")({
	component: AuthenticatePage,
});

function AuthenticatePage() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4">
			<Show when="signed-out">
				<AuthTabs />
				<Link
					to="/privacy"
					className="text-sm text-muted-foreground underline underline-offset-4"
				>
					Privacy
				</Link>
			</Show>
			{/* Clerk navigates home after sign in; this also covers landing here already signed in. */}
			<Show when="signed-in">
				<Navigate to="/" replace />
			</Show>
		</div>
	);
}
