import { CopyButton } from "@/components";
import { FieldLayout } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

type Props = {
	originalUrl: string;
	shortUrl: string;
	resetUrls: () => void;
};

// temporary while using proxy. use VITE_API_URL when deployed
export const localApi = "http://localhost:3000/";

export function LinkResult({ originalUrl, shortUrl, resetUrls }: Props) {
	const fullShortUrl = localApi + shortUrl;

	return (
		<FieldGroup>
			<FieldLayout label="Original URL" fieldName="original-url">
				<Input id="original-url" value={originalUrl} readOnly />
			</FieldLayout>
			<FieldLayout label="Short URL" fieldName="short-url">
				<InputGroup>
					<InputGroupInput id="short-url" value={fullShortUrl} readOnly />
					<InputGroupAddon>
						<CopyButton text={fullShortUrl} label={"copy short URL"} />
					</InputGroupAddon>
				</InputGroup>
			</FieldLayout>
			<Button onClick={resetUrls} className={"w-full"}>
				Create Another
			</Button>
		</FieldGroup>
	);
}
