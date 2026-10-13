import { Link } from "@tanstack/react-router";
import { memo } from "react";
import { ModeToggle } from "../mode-toggle";

export const SiteHeader = memo(function SiteHeader() {
	return (
		<header className=" h-15 shrink-0 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) w-full">
			<div className="flex w-full items-center gap-1 px-2  h-full bg-background justify-between">
				<Link to="/">
					<h1 className="font-display text-7xl">URL SHORTENER</h1>
				</Link>
				<ModeToggle />
			</div>
		</header>
	);
});
