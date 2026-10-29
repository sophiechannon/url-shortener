import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUrlLengthType } from "@/lib";

export function HeroCard() {
	const text = `This site uses AWS Lambda Function URLs and no custom domain... so enjoy
				turning your carefully constructed URLs into ${getUrlLengthType()} and
				complicated ones that don't make any sense!`;
	return (
		<Card className="xl:flex-1 bg-linear-to-r from-yellow-100 from-10% to-yellow-200 border-yellow-200 dark:text-yellow-200 dark:bg-none dark:bg-card">
			<CardHeader>
				<CardTitle className="text-2xl sm:text-4xl">
					Consistently {getUrlLengthType()} and annoying URLs.
				</CardTitle>
			</CardHeader>
			<CardContent className="text-lg">
				<Accordion className={"block sm:hidden border-0"}>
					<AccordionItem>
						<AccordionTrigger>More</AccordionTrigger>
						<AccordionContent>{text}</AccordionContent>
					</AccordionItem>
				</Accordion>
				<div className="hidden sm:block">{text}</div>
			</CardContent>
		</Card>
	);
}
