import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinksTable } from "./links-table";

type Props = {
	className?: string;
};

export function MyLinksCard({ className }: Props) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>My Links</CardTitle>
			</CardHeader>
			<CardContent className="overflow-auto">
				<LinksTable />
			</CardContent>
		</Card>
	);
}
