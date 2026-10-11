import { Icon } from "../icon";
import { Button } from "../ui/button";
import { useCopyLink } from "./use-copy-link";

type Props = {
	text: string;
	label: string;
};

export function CopyButton({ label, text }: Props) {
	const { copied, copyToClipboard } = useCopyLink();
	const copyIconName = copied ? "copyCheck" : "copy";
	const copyButtonColor = copied ? "bg-chart-3 hover:bg-chart-2" : "bg-primary";
	const handleCopy = () => copyToClipboard(text);
	return (
		<Button
			size="icon"
			aria-label={label}
			onClick={handleCopy}
			aria-live="polite"
			className={copyButtonColor}
		>
			<Icon name={copyIconName} />
		</Button>
	);
}
