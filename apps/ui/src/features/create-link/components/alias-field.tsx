import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

type Props = {
	value: string;
	onChange: (value: string) => void;
};
export function AliasField({ value, onChange }: Props) {
	return (
		<InputGroup>
			<InputGroupInput
				value={value}
				onChange={(event) => onChange(event.target.value)}
			/>
		</InputGroup>
	);
}
