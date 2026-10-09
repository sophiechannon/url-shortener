import { createFileRoute } from "@tanstack/react-router";
import { CreateLinkCard } from "@/features/create-link";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	return <CreateLinkCard />;
}
