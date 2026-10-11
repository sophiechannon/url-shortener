import { useEffect, useRef, useState } from "react";
import { showToast } from "@/lib/toast";

export function useCopyLink() {
	const [copied, setCopied] = useState(false);
	const timeout = useRef<number>(undefined);

	useEffect(() => () => window.clearTimeout(timeout.current), []);

	async function copyToClipboard(value: string) {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			window.clearTimeout(timeout.current);
			timeout.current = window.setTimeout(() => setCopied(false), 3000);
		} catch {
			showToast("Failed to copy to clipboard", "error");
		}
	}

	return { copied, copyToClipboard };
}
