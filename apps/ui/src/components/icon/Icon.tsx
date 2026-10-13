import {
	Check,
	Copy,
	CopyCheck,
	type LucideProps,
	Moon,
	Sun,
	Trash,
	X,
} from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib";

export const ICON_KEYS = [
	"x",
	"check",
	"copy",
	"copyCheck",
	"bin",
	"sun",
	"moon",
] as const;

export type IconKey = (typeof ICON_KEYS)[number];

const icons = new Map<IconKey, ComponentType<LucideProps>>([
	["x", X],
	["check", Check],
	["copy", Copy],
	["copyCheck", CopyCheck],
	["bin", Trash],
	["sun", Sun],
	["moon", Moon],
]);

type IconProps = LucideProps & { name: IconKey };

export function Icon({ name, ...iconProps }: IconProps) {
	const Cmp = icons.get(name);

	if (!Cmp) {
		return null;
	}

	const mergedIconProps: LucideProps = {
		...iconProps,
		className: cn("h-4 w-4", iconProps?.className),
	};
	return <Cmp {...mergedIconProps} />;
}
