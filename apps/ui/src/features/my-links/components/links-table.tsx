import { Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	flexRender,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { CopyButton } from "@/components";
import { useLinksTable } from "../hooks/use-links-table";
import type { LinkRow } from "../schemas/link-row";

const _features = tableFeatures({});

const columns: ColumnDef<typeof _features, LinkRow>[] = [
	{
		accessorKey: "shortUrl",
		header: "Short URL",
		cell: ({ row }) => (
			<div className="flex flex-row gap-2">
				<CopyButton label="copy short URL" text={row.original.shortUrl} />
				<Link to={row.original.shortUrl}>{row.original.shortUrl}</Link>
			</div>
		),
	},
	{
		accessorKey: "originalUrl",
		header: "Original URL",
		cell: ({ row }) => (
			<Link to={row.original.originalUrl}>{row.original.originalUrl}</Link>
		),
	},
	{ accessorKey: "actions", header: "Actions" },
];

export function LinksTable() {
	const { linkRows } = useLinksTable();
	const table = useTable<typeof _features, LinkRow>({
		features: _features,
		data: linkRows,
		columns,
	});

	return (
		<table className="w-full text-left text-sm">
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th key={header.id} className="p-2 font-medium">
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext(),
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
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
