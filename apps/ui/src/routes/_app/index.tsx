import { Show, useAuth } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthTabs } from "@/features/auth";
import { CreateLinkCard } from "@/features/create-link";
import { LinksTablePlaceholder, MyLinksCard } from "@/features/links-table";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	const { isSignedIn } = useAuth();
	// Stays mounted so it can animate both ways; closed while Clerk is loading.
	const isPlaceholderOpen = isSignedIn === false;

	return (
		<div className="grid h-full grid-cols-1 grid-rows-[1fr_auto_3fr]">
			<div className="row-start-2 flex w-full flex-col lg:flex-row gap-6">
				<CreateLinkCard className="min-w-0 flex-1 flex">
					{/* 0fr -> 1fr eases the height; the negative margin cancels the card's gap-10 while closed. */}
					<div
						data-open={isPlaceholderOpen}
						inert={!isPlaceholderOpen}
						className="grid grid-rows-[0fr] -mt-10 transition-[grid-template-rows,margin] duration-200 ease-linear motion-reduce:transition-none data-[open=true]:mt-0 data-[open=true]:grid-rows-[1fr]"
					>
						<div className="min-h-0 overflow-hidden">
							<LinksTablePlaceholder>
								Coming soon... signed out links
							</LinksTablePlaceholder>
						</div>
					</div>
				</CreateLinkCard>
				<div className="min-w-0 flex-1 flex justify-center">
					<Show when={"signed-in"}>
						<MyLinksCard />
					</Show>
					<Show when={"signed-out"}>
						<AuthTabs />
					</Show>
				</div>
			</div>
		</div>
	);
}
