import { Show } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthTabs } from "@/features/auth";
import { CreateLinkCard } from "@/features/create-link";
import { MyLinksCard } from "@/features/links-table";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="grid h-full grid-cols-1 grid-rows-[1fr_auto_3fr]">
			<div className="row-start-2 flex w-full flex-col lg:flex-row gap-6">
				<CreateLinkCard className="min-w-0 flex-1" />
				<Show when={"signed-in"}>
					<MyLinksCard className="min-w-0 flex-1" />
				</Show>
				<Show when={"signed-out"}>
					<AuthTabs />
				</Show>
			</div>
		</div>
	);
}
