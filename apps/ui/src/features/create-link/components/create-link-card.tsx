import { useAuth } from "@clerk/react";
import { memo, type PropsWithChildren, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateLinkCardForm } from "./create-link-card-form";
import { LinkResult } from "./link-result-card";

type Props = PropsWithChildren & {
	className?: string;
};

export const CreateLinkCard = memo(function CreateLinkCard({
	className,
	children,
}: Props) {
	const { isSignedIn } = useAuth();
	const [urls, setUrls] = useState<{ shortUrl: string; originalUrl: string }>();
	const getHeader = () => {
		if (isSignedIn == null) return <Skeleton className="h-7" />;
		if (urls) {
			return "Success! Your short URL...";
		}
		return isSignedIn ? "Lengthen any URL..." : "Give it a go...";
	};
	const resetUrls = () => {
		setUrls(undefined);
	};
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{getHeader()}</CardTitle>
			</CardHeader>
			<CardContent className="gap-10 flex flex-1 flex-col justify-center">
				{!urls ? (
					<CreateLinkCardForm setShortUrl={setUrls} />
				) : (
					<LinkResult
						shortUrl={urls.shortUrl}
						originalUrl={urls.originalUrl}
						resetUrls={resetUrls}
					/>
				)}
				{children}
			</CardContent>
		</Card>
	);
});
