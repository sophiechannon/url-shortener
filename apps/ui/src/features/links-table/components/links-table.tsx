import { Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	FlexRender,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { Suspense, useRef } from "react";
import { CopyButton } from "@/components";
import { InfiniteScroll } from "@/components/inifinite-scroll/infinite-scroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLinksTable } from "../hooks/use-links-table";
import type { LinkRow } from "../schemas/link-row";
import { DeleteLinkButton } from "./delete-button";
import { LinksTableSkeleton } from "./links-table-skeleton";

const _features = tableFeatures({});

const columns: ColumnDef<typeof _features, LinkRow>[] = [
	{
		accessorKey: "shortUrl",
		header: "Short URL",
		cell: ({ row }) => {
			return (
				<div className="flex flex-row gap-2 align-middle">
					<CopyButton
						label="copy short URL"
						text={row.original.shortUrl.display}
					/>
					<Link to={row.original.shortUrl.display}>
						{row.original.shortUrl.display}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: "originalUrl",
		header: "Original URL",
		cell: ({ row }) => (
			<Link to={row.original.originalUrl}>{row.original.originalUrl}</Link>
		),
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => (
			<DeleteLinkButton shortUrl={row.original.shortUrl.key} />
		),
	},
];

export function LinksTable() {
	const { linkRows, ...rest } = useLinksTable();
	const table = useTable<typeof _features, LinkRow>({
		features: _features,
		data: linkRows,
		columns,
	});
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	return (
		<ScrollArea className="h-50" ref={scrollContainerRef}>
			<InfiniteScroll containerRef={scrollContainerRef} {...rest}>
				<table className="w-full text-left text-sm">
					<thead className="sticky top-0 bg-card">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className="p-2 font-medium">
										{header.isPlaceholder ? null : (
											<FlexRender header={header} />
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getAllCells().map((cell) => (
									<td key={cell.id} className="p-2">
										<FlexRender cell={cell} />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</InfiniteScroll>
		</ScrollArea>
	);
}

export function LinksTableSuspense() {
	return (
		<Suspense fallback={<LinksTableSkeleton />}>
			<LinksTable />
		</Suspense>
	);
}
