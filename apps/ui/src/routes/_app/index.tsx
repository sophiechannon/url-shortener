import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateLinkCard } from "@/features/create-link";
import { MyLinksCard } from "@/features/links-table";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="min-h-0 flex-1 overflow-auto gap-6 flex flex-col">
			<div className="flex w-full flex-col xl:flex-row gap-6 p-20 bg-primary border-b-yellow-200 border-b-8">
				<Card className="xl:flex-1 bg-linear-to-r from-yellow-100 from-10% to-yellow-200 border-yellow-200 dark:text-yellow-200 dark:bg-none dark:bg-card">
					<CardHeader>
						<CardTitle className="text-4xl">
							Consistently long and annoying URLS. Guaranteed.
						</CardTitle>
					</CardHeader>
					<CardContent className="text-lg">
						This site uses AWS Lambda and Function URLs, and I don't want to
						spend any money on a custom domain... so enjoy turning your
						carefully constructed URLs into long and complicated ones that don't
						make any sense!
					</CardContent>
				</Card>
				<CreateLinkCard className="min-w-0 xl:flex-1"></CreateLinkCard>
			</div>
			<div className="px-20 pb-10">
				<MyLinksCard />
			</div>
		</div>
	);
}
