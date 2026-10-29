import { createFileRoute } from "@tanstack/react-router";
import { CreateLinkCard } from "@/features/create-link";
import { HeroCard } from "@/features/hero";
import { MyLinksCard } from "@/features/links-table";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="min-h-0 flex-1 overflow-auto gap-6 flex flex-col">
			<div className="flex w-full flex-col xl:flex-row gap-6 p-4 sm:p-20 bg-primary border-b-8">
				<HeroCard />
				<CreateLinkCard className="min-w-0 xl:flex-1" />
			</div>
			<div className="flex min-h-100 max-h-175 flex-1 flex-col px-4 sm:px-20 pb-20">
				<MyLinksCard />
			</div>
		</div>
	);
}
