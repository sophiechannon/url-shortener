import { FieldLayout } from "@/components/form";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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

export function LinkResultCard({ originalUrl, shortUrl }: Props) {
	return (
		<CardContent>
			<FieldGroup>
				<FieldLayout label="Original URL" fieldName="original-url">
					<Input value={originalUrl} />
				</FieldLayout>
				<FieldLayout label="Original URL" fieldName="original-url">
					<InputGroup>
						<InputGroupInput value={shortUrl} />
						<InputGroupAddon>
							<Button size="icon" aria-label="copy short url">
								<Icon name="copy" />
							</Button>
						</InputGroupAddon>
					</InputGroup>
				</FieldLayout>
			</FieldGroup>
		</CardContent>
	);
}
