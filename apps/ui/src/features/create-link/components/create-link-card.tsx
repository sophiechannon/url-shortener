import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useCheckAliasAvailability } from "../hooks/use-check-alias-availability";
import { useCreateLink } from "../hooks/use-post-link";
import { AliasField } from "./alias-field";

// Mirrors the CreateLink schema from the API; alias is optional, so "" means "none".
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

export function CreateLinkCard() {
	const [shortUrl, setShortUrl] = useState<string>();
	// The last alias whose availability check settled. TanStack Form's
	// field.state.meta.isValidating is unreliable here (see isAliasPending below).
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
				setShortUrl(res.data.shortUrl);
				formApi.reset();
			} catch {
				// do something (e.g. map a 409 onto the alias field error)
			}
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Give us any URL and we'll shorten it</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
				>
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
					<div className="pt-4">
						<form.Subscribe
							selector={(state) =>
								[state.canSubmit, state.isSubmitting] as const
							}
						>
							{([canSubmit, isSubmitting]) => (
								<Button type="submit" disabled={!canSubmit || isSubmitting}>
									Submit
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
				{!!shortUrl && <div>{shortUrl}</div>}
			</CardContent>
		</Card>
	);
}
