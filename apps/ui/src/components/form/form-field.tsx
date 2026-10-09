import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentProps } from "react";

import { cn } from "@/lib";
import { Field, FieldError, FieldLabel } from "../ui/field";

type Props = ComponentProps<typeof Field> & {
	label: string;
	field: AnyFieldApi;
	required: boolean;
};

export function FormField({
	children,
	label,
	field,
	required,

	...rest
}: Props) {
	const errors = field.state.meta.errors;
	const isInvalid = !!errors?.length && field.state.meta.isTouched;

	return (
		<Field data-invalid={isInvalid} {...rest}>
			<div className={cn("flex flex-row justify-between items-center")}>
				<FieldLabel
					htmlFor={field.name}
					aria-required={required}
					className="gap-1"
				>
					{label}
					{required && <span className="text-red-600">*</span>}
				</FieldLabel>
			</div>
			{children}
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
