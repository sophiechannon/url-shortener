import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { useDeleteLink } from "../hooks/queries/use-delete-link";

type Props = {
	shortUrl: string;
};
export function DeleteLinkButton({ shortUrl }: Props) {
	const deleteLink = useDeleteLink();
	// mutate() never throws, so failures are handled in onError rather than try/catch.
	const handleDelete = () => {
		deleteLink.mutate(
			{ id: shortUrl },
			{ onError: () => showToast("Link could not be deleted", "error") },
		);
	};
	return (
		<Button size="icon" aria-label="delete link" onClick={handleDelete}>
			<Icon name="bin" />
		</Button>
	);
}
