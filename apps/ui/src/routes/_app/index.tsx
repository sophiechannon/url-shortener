import { createFileRoute } from "@tanstack/react-router";
import { useGetHealth } from "@/api/generated";
import { CreateLinkCard } from "@/features/create-link";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	// Placeholder to prove the generated client is wired up; replace with the real page.
	const health = useGetHealth();

	return (
		<>
			<CreateLinkCard />
			{health.data?.data.status}
		</>
	);
}
