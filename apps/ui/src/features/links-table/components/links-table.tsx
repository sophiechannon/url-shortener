import { Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	FlexRender,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { Suspense, useEffect, useRef } from "react";
import { CopyButton } from "@/components";
import { InfiniteScroll } from "@/components/inifinite-scroll/infinite-scroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLinksTable } from "../hooks/use-links-table";
import type { LinkRow } from "../schemas/link-row";
import { DeleteLinkButton } from "./delete-button";
import { LinksTablePlaceholder } from "./links-table-placeholder";
import { LinksTableSkeleton } from "./links-table-skeleton";

const _features = tableFeatures({});

type Props = {
	placeholder?: string;
};

const columns: ColumnDef<typeof _features, LinkRow>[] = [
	{
		accessorKey: "shortUrl",
		header: "Short URL",
		cell: ({ row }) => {
			return (
				<div className="flex flex-row gap-2 align-top">
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
			<Link
				className="wrap-anywhere align-top h-full"
				to={row.original.originalUrl}
			>
				{row.original.originalUrl}
			</Link>
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

export function LinksTable({ placeholder }: Props) {
	const { linkRows, ...rest } = useLinksTable();
	const table = useTable<typeof _features, LinkRow>({
		features: _features,
		data: linkRows,
		columns,
	});

	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const stuckSentinelRef = useRef<HTMLDivElement>(null);
	const tableHeadRef = useRef<HTMLTableSectionElement>(null);
	const hasRows = linkRows.length > 0;

	useEffect(() => {
		const sentinel = stuckSentinelRef.current;
		const tableHead = tableHeadRef.current;
		if (!hasRows || !sentinel || !tableHead) {
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				tableHead.toggleAttribute("data-stuck", !entry.isIntersecting);
			},
			{ root: scrollContainerRef.current, threshold: 0 },
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasRows]);

	if (!linkRows.length) {
		return (
			<LinksTablePlaceholder>
				{placeholder ?? "You have no links yet, why not create one now?"}
			</LinksTablePlaceholder>
		);
	}

	return (
		<ScrollArea className="h-full" ref={scrollContainerRef}>
			<InfiniteScroll containerRef={scrollContainerRef} {...rest}>
				<div ref={stuckSentinelRef} aria-hidden />
				<table className="w-full text-left text-sm">
					<thead
						className="sticky top-0 bg-card data-stuck:shadow-sm"
						ref={tableHeadRef}
					>
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
									<td key={cell.id} className="p-2 align-top">
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
			<div className="min-h-0 flex-1">
				<LinksTable />
			</div>
		</Suspense>
	);
}
