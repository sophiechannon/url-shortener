import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { ApiError } from "@/api/fetcher";
import { FormField } from "@/components";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { showToast } from "@/lib/toast";
import { useCheckAliasAvailability } from "../hooks/queries/use-check-alias-availability";
import { useCreateLink } from "../hooks/queries/use-post-link";
import { AliasField } from "./alias-field";

const createLinkSchema = z.object({
	originalUrl: z.url("Enter a valid URL"),
	alias: z
		.string()
		.regex(/^[A-Za-z0-9_-]{3,32}$/, "3-32 letters, numbers, - or _")
		.or(z.literal("")),
});

// Pending covers the debounce window and the request: a non-empty alias that passed
// the sync/schema checks but hasn't had its availability check settle yet.
// We don't use field.state.meta.isValidating: in @tanstack/form-core 1.33.5 a stale
// timeout id makes every run after the first decrement the pending counter right away.
function isAliasPending(
	alias: string,
	syncError: unknown,
	checkedAlias: string | undefined,
) {
	return !!alias && !syncError && alias !== checkedAlias;
}

type Props = {
	setShortUrl: (value: { shortUrl: string; originalUrl: string }) => void;
};

export function CreateLinkCardContent({ setShortUrl }: Props) {
	const [checkedAlias, setCheckedAlias] = useState<string>();
	const checkAliasAvailability = useCheckAliasAvailability();
	const createLink = useCreateLink();

	const form = useForm({
		defaultValues: { originalUrl: "", alias: "" },
		validators: { onChange: createLinkSchema },
		onSubmit: async ({ value, formApi }) => {
			try {
				const res = await createLink.mutateAsync({
					data: {
						originalUrl: value.originalUrl,
						alias: value.alias || undefined,
					},
				});
				setShortUrl({
					shortUrl: res.data.shortUrl,
					originalUrl: res.data.originalUrl,
				});
				formApi.reset();
			} catch (error) {
				if (error instanceof ApiError && error.status === 409) {
					// TanStack Form clears onSubmit errors on the field's next change.
					formApi.setFieldMeta("alias", (meta) => ({
						...meta,
						errorMap: {
							...meta.errorMap,
							onSubmit: { message: "Not available" },
						},
					}));
					return;
				}
				showToast("There was a problem creating your link", "error");
			}
		},
	});

	return (
		<CardContent>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					<form.Field name="originalUrl">
						{(field) => (
							<FormField field={field} label="URL" required>
								<InputGroup>
									<InputGroupInput
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
									/>
								</InputGroup>
							</FormField>
						)}
					</form.Field>
					<form.Field
						name="alias"
						validators={{
							onChangeAsync: async ({ value, signal }) => {
								if (!value) return undefined;
								try {
									const isAvailable = await checkAliasAvailability(
										value,
										signal,
									);
									return isAvailable ? undefined : { message: "Not available" };
								} finally {
									if (!signal.aborted) setCheckedAlias(value);
								}
							},
						}}
						asyncDebounceMs={300}
					>
						{(field) => (
							<FormField field={field} label="Alias" required={false}>
								<AliasField
									value={field.state.value}
									onChange={field.handleChange}
									isPending={isAliasPending(
										field.state.value,
										field.state.meta.errorMap.onChange,
										checkedAlias,
									)}
									isValid={field.state.meta.isValid}
								/>
							</FormField>
						)}
					</form.Field>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting] as const}
					>
						{([canSubmit, isSubmitting]) => (
							<Button type="submit" disabled={!canSubmit || isSubmitting}>
								Submit
							</Button>
						)}
					</form.Subscribe>
				</FieldGroup>
			</form>
		</CardContent>
	);
}
