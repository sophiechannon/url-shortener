import type { AnyFieldMeta } from "@tanstack/react-form";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib";
import { FieldError, FieldLabel } from "../ui/field";

type Props = PropsWithChildren & {
	label: string;
	fieldName: string;
	required?: boolean;
	isInvalid?: boolean;
	errors?: AnyFieldMeta["errors"];
};

export function FieldLayout({
	children,
	label,
	fieldName,
	required,
	errors,
	isInvalid,
}: Props) {
	return (
		<>
			<div className={cn("flex flex-row justify-between items-center")}>
				<FieldLabel
					htmlFor={fieldName}
					aria-required={required}
					className="gap-1"
				>
					{label}
					{required && <span className="text-red-600">*</span>}
				</FieldLabel>
			</div>
			{children}
			{isInvalid && <FieldError errors={errors} />}
		</>
	);
}
