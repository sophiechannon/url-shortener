import { createFileRoute } from "@tanstack/react-router";
import { CreateLinkCard } from "@/features/create-link";
import { MyLinksCard } from "@/features/links-table";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="flex flex-row gap-6">
			<CreateLinkCard className="flex-1" />
			<MyLinksCard className="flex-1" />
		</div>
	);
}
