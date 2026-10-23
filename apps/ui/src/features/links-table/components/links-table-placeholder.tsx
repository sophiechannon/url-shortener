import type { PropsWithChildren } from "react";
import { Icon } from "@/components/icon";

export function LinksTablePlaceholder({ children }: PropsWithChildren) {
	return (
		<div className="h-50 flex justify-between">
			{children}
			<Icon name="link" className="h-50 w-50 text-primary" />
		</div>
	);
}
