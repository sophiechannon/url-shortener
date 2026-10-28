import { Skeleton } from "@/components/ui/skeleton";
import { getUrlLengthType } from "@/lib/config";

const ROWS = 5;
const HEADERS = [
	`${getUrlLengthType({ capitalize: true })} URL`,
	"Original URL",
	"Actions",
];

export function LinksTableSkeleton() {
	return (
		<table className="w-full text-left text-sm" aria-busy="true">
			<thead>
				<tr>
					{HEADERS.map((header) => (
						<th key={header} className="p-2">
							<Skeleton className="h-6 flex-1" />
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{Array.from({ length: ROWS }, (_, row) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Not real data
					<tr key={row}>
						<td colSpan={HEADERS.length} className="p-2">
							<div className="flex flex-row items-center gap-2">
								<Skeleton className="size-7 shrink-0" />
								<Skeleton className="h-4 flex-1" />
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
