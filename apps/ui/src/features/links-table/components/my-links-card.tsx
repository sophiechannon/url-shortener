import { useAuth } from "@clerk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinksTableSuspense } from "./links-table";
import { LinksTablePlaceholder } from "./links-table-placeholder";

type Props = {
	className?: string;
};

export function MyLinksCard({ className }: Props) {
	const { isSignedIn } = useAuth();

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>My Links</CardTitle>
			</CardHeader>
			<CardContent className="pb-2">
				{isSignedIn ? (
					<LinksTableSuspense />
				) : (
					<LinksTablePlaceholder>
						Coming soon... signed out links
					</LinksTablePlaceholder>
				)}
			</CardContent>
		</Card>
	);
}
