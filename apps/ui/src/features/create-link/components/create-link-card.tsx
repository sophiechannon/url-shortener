import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateLinkCardContent } from "./create-link-card-content";
import { LinkResultCard } from "./link-result-card-content";

export function CreateLinkCard() {
	const [urls, setUrls] = useState<{ shortUrl: string; originalUrl: string }>();
	const header = urls ? "Success! Your short URL..." : "Shorten any URL...";
	const resetUrls = () => {
		setUrls(undefined);
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>{header}</CardTitle>
			</CardHeader>
			<CardContent>
				{!urls ? (
					<CreateLinkCardContent setShortUrl={setUrls} />
				) : (
					<LinkResultCard
						shortUrl={urls.shortUrl}
						originalUrl={urls.originalUrl}
						resetUrls={resetUrls}
					/>
				)}
			</CardContent>
		</Card>
	);
}
