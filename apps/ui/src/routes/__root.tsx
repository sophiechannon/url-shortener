import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	return (
		<>
			<header>
				<nav>
					<Link to="/">URL Shortener</Link>
				</nav>
			</header>
			<main>
				<Outlet />
			</main>
			<TanStackRouterDevtools />
		</>
	);
}
