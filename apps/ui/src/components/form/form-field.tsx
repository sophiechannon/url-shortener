import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentProps } from "react";

import { Field } from "../ui/field";
import { FieldLayout } from "./field-layout";

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
			<FieldLayout
				fieldName={field.name}
				label={label}
				errors={errors}
				isInvalid={isInvalid}
				required={required}
			>
				{children}
			</FieldLayout>
		</Field>
	);
}
