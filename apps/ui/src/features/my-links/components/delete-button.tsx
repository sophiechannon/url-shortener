import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { useDeleteLink } from "../hooks/queries/use-delete-link";

type Props = {
	shortUrl: string;
};
export function DeleteLinkButton({ shortUrl }: Props) {
	const deleteLink = useDeleteLink();
	const handleDelete = async () => {
		try {
			void deleteLink.mutate({ id: shortUrl });
		} catch {
			showToast("Link could not be delete", "error");
		}
	};
	return (
		<Button size="icon" aria-label="delete link" onClick={handleDelete}>
			<Icon name="bin" />
		</Button>
	);
}
