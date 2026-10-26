import { Show, UserButton } from "@clerk/react";
import { Link } from "@tanstack/react-router";
import { memo } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "../mode-toggle";

export const SiteHeader = memo(function SiteHeader() {
	return (
		<header className=" h-15 shrink-0 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) w-full">
			<div className="flex w-full items-center gap-1 px-2  h-full bg-linear-to-r from-primary/70 from-60% to-primary to-80% justify-between">
				<Link to="/">
					<h1 className="font-display text-7xl">URL LENGTHENER</h1>
				</Link>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<Show when="signed-out">
						<Link to="/authenticate" className={buttonVariants()}>
							Sign in
						</Link>
					</Show>
					<Show when="signed-in">
						<UserButton />
					</Show>
				</div>
			</div>
		</header>
	);
});
