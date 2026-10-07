import { createFileRoute } from "@tanstack/react-router";
import { useGetHealth } from "../api/generated/health/health";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	// Placeholder to prove the generated client is wired up; replace with the real page.
	const health = useGetHealth();

	return (
		<>
			<h1>Shorten a URL</h1>
			<p>
				API status:{" "}
				{health.isPending
					? "checking…"
					: health.isError
						? "unreachable"
						: health.data.data.status}
			</p>
		</>
	);
}
