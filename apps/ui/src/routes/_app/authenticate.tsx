import { Show } from "@clerk/react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthTabs } from "@/features/auth";

export const Route = createFileRoute("/_app/authenticate")({
	component: AuthenticatePage,
});

function AuthenticatePage() {
	return (
		<div className="flex h-full items-center justify-center">
			<Show when="signed-out">
				<AuthTabs />
			</Show>
			{/* Clerk navigates home after sign in; this also covers landing here already signed in. */}
			<Show when="signed-in">
				<Navigate to="/" replace />
			</Show>
		</div>
	);
}
