import { useAuth } from "@clerk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
					Coming soon... signed out links
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
