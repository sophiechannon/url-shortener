import { useAuth } from "@clerk/react";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib";
import { LinksTableSuspense } from "./links-table";
import { LinksTablePlaceholder } from "./links-table-placeholder";
import { LinksTableSkeleton } from "./links-table-skeleton";

type Props = {
	className?: string;
};

function LinksCardChildren() {
	const { isSignedIn } = useAuth();

	if (isSignedIn == null) {
		return <LinksTableSkeleton />;
	}
	return (
		<>
			{isSignedIn ? (
				<LinksTableSuspense />
			) : (
				<LinksTablePlaceholder>
					<div className="gap-4 flex flex-col">
						<div className="text-lg">
							Sign in to save and view all your links
						</div>
						<Link to="/authenticate" className={cn(buttonVariants(), "w-fit")}>
							Sign in
						</Link>
						<div>Coming soon... signed out links</div>
					</div>
				</LinksTablePlaceholder>
			)}
		</>
	);
}

export function MyLinksCard({ className }: Props) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>My Links</CardTitle>
			</CardHeader>
			<CardContent className="flex min-h-0 flex-1 flex-col pb-2">
				<LinksCardChildren />
			</CardContent>
		</Card>
	);
}
