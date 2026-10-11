import { toast } from "@/components/ui/toast";

export type ToastType = "success" | "error" | "info" | "warning";

export function showToast(message: string, type: ToastType = "info") {
	return toast.add({ title: message, type });
}
