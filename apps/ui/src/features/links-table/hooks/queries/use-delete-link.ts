import { useQueryClient } from "@tanstack/react-query";
import {
	getListLinksInfiniteQueryKey,
	useDeleteLink as useDeleteLinkMutation,
} from "@/api/generated";

export function useDeleteLink() {
	const queryClient = useQueryClient();

	return useDeleteLinkMutation({
		mutation: {
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: getListLinksInfiniteQueryKey(),
				});
			},
		},
	});
}
