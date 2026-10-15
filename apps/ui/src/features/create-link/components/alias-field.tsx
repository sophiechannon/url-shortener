import { Icon } from "@/components/icon";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

type Props = {
	id?: string;
	value: string;
	onChange: (value: string) => void;
	isPending: boolean;
	isValid: boolean;
};
export function AliasField({ id, value, onChange, isPending, isValid }: Props) {
	return (
		<InputGroup>
			<InputGroupInput
				id={id}
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
