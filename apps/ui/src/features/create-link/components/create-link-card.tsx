import { type ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useCreateLink } from "../hooks/use-post-link";

export function CreateLinkCard() {
	const [originalUrl, setOriginalUrl] = useState<string>("");
	const [shortUrl, setShortUrl] = useState<string>();
	const createLink = useCreateLink();
	const handleInputChange: ComponentProps<typeof InputGroupInput>["onChange"] =
		(event) => {
			const value = event.target.value;
			setOriginalUrl(value);
		};
	const onSubmit = async () => {
		try {
			const res = await createLink.mutateAsync({
				data: {
					originalUrl: originalUrl,
				},
			});
			setOriginalUrl("");
			setShortUrl(res.data.shortUrl);
		} catch {
			// do something
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Give us any URL and we'll shorten it</CardTitle>
			</CardHeader>
			<CardContent>
				<InputGroup>
					<InputGroupInput value={originalUrl} onChange={handleInputChange} />
				</InputGroup>
				<Button onClick={onSubmit}>Submit</Button>
				{!!shortUrl && <div>{shortUrl}</div>}
			</CardContent>
		</Card>
	);
}
