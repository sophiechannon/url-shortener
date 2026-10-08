import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components";

export const Route = createFileRoute("/_app")({
	component: AppLayout,
});

function AppLayout() {
	return (
		<div>
			<SiteHeader />
			<div className="h-screen w-screen p-4">
				<Outlet />
			</div>
		</div>
	);
}
