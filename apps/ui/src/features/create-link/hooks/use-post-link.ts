import { useQueryClient } from "@tanstack/react-query";
import { getListLinksQueryKey, usePostLink } from "@/api/generated";

export function useCreateLink() {
	const queryClient = useQueryClient();

	return usePostLink({
		mutation: {
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: getListLinksQueryKey(),
				});
			},
		},
	});
}
