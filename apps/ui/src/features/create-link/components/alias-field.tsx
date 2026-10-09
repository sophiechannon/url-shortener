import { Icon } from "@/components/icon";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

type Props = {
	value: string;
	onChange: (value: string) => void;
	isPending: boolean;
	isValid: boolean;
};
export function AliasField({ value, onChange, isPending, isValid }: Props) {
	return (
		<InputGroup>
			<InputGroupInput
				value={value}
				onChange={(event) => onChange(event.target.value)}
			/>
			<InputGroupAddon>
				<StatusIcon isPending={isPending} isValid={isValid} isEmpty={!value} />
			</InputGroupAddon>
		</InputGroup>
	);
}

type StatusIconProps = {
	isEmpty: boolean;
	isPending: boolean;
	isValid: boolean;
};

function StatusIcon({ isEmpty, isPending, isValid }: StatusIconProps) {
	console.log("isEmpty", isEmpty, "isPending", isPending, "isValid", isValid);

	if (isEmpty) {
		return null;
	}
	if (isPending) {
		return <Spinner />;
	}
	return !isValid ? (
		<Icon name="x" className="text-red-600" />
	) : (
		<Icon name="check" className="text-green-600" />
	);
}
