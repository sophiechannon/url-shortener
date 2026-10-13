import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinksTableSuspense } from "./links-table";

type Props = {
	className?: string;
};

export function MyLinksCard({ className }: Props) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>My Links</CardTitle>
			</CardHeader>
			<CardContent className="pb-2">
				<LinksTableSuspense />
			</CardContent>
		</Card>
	);
}
