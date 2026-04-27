import * as React from "react";
import "./styles.css";

export type SortDirection = "asc" | "desc" | null;

export interface TableColumn<T> {
	/** Unique key, used to read from row data and to identify the column */
	key: keyof T | string;
	/** Header label */
	header: string;
	/** Whether this column is sortable */
	sortable?: boolean;
	/** Optional custom cell renderer */
	render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
	columns: TableColumn<T>[];
	data: T[];
	/** Optional global filter placeholder */
	filterPlaceholder?: string;
	/** Initial page size */
	initialPageSize?: number;
	/** Page size options */
	pageSizeOptions?: number[];
	/** Accessible label for the table */
	ariaLabel?: string;
}

export function Table<T extends Record<string, any>>({
	columns,
	data,
	filterPlaceholder = "Filter rows…",
	initialPageSize = 10,
	pageSizeOptions = [5, 10, 20, 50],
	ariaLabel = "Data table",
}: TableProps<T>) {
	const [filterText, setFilterText] = React.useState("");
	const [sortKey, setSortKey] = React.useState<string | null>(null);
	const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
	const [pageSize, setPageSize] = React.useState(initialPageSize);
	const [pageIndex, setPageIndex] = React.useState(0);

	// Reset page to 0 when filter or page size changes
	React.useEffect(() => {
		setPageIndex(0);
	}, [filterText, pageSize]);

	const filteredData = React.useMemo(() => {
		if (!filterText.trim()) return data;
		const query = filterText.toLowerCase();
		return data.filter((row) =>
			columns.some((col) => {
				const key = col.key as keyof T;
				const value = row[key];
				if (value == null) return false;
				return String(value).toLowerCase().includes(query);
			}),
		);
	}, [data, filterText, columns]);

	const sortedData = React.useMemo(() => {
		if (!sortKey || !sortDirection) return filteredData;

		const col = columns.find((c) => c.key === sortKey);
		if (!col || !col.sortable) return filteredData;

		const copy = [...filteredData];

		copy.sort((a, b) => {
			const aVal = (a as any)[sortKey];
			const bVal = (b as any)[sortKey];

			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return sortDirection === "asc" ? -1 : 1;
			if (bVal == null) return sortDirection === "asc" ? 1 : -1;

			// Basic comparison; can be customized per column if needed
			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
			}

			const aStr = String(aVal).toLowerCase();
			const bStr = String(bVal).toLowerCase();
			if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
			if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});

		return copy;
	}, [filteredData, sortKey, sortDirection, columns]);

	const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
	const currentPageIndex = Math.min(pageIndex, pageCount - 1);
	const paginatedData = React.useMemo(() => {
		const start = currentPageIndex * pageSize;
		return sortedData.slice(start, start + pageSize);
	}, [sortedData, currentPageIndex, pageSize]);

	function handleSort(col: TableColumn<T>) {
		if (!col.sortable) return;
		const key = col.key as string;
		if (sortKey !== key) {
			setSortKey(key);
			setSortDirection("asc");
		} else {
			// cycle: asc -> desc -> off
			setSortDirection((prev) =>
				prev === "asc" ? "desc" : prev === "desc" ? null : "asc",
			);
			if (sortDirection === null) {
				setSortKey(null);
			}
		}
	}

	function renderSortIndicator(col: TableColumn<T>) {
		if (!col.sortable) return null;
		if (sortKey !== col.key) {
			return (
				<span
					aria-hidden="true"
					style={{ marginLeft: "0.25rem", opacity: 0.4 }}
				>
					↕
				</span>
			);
		}
		if (sortDirection === "asc") {
			return (
				<span aria-hidden="true" style={{ marginLeft: "0.25rem" }}>
					↑
				</span>
			);
		}
		if (sortDirection === "desc") {
			return (
				<span aria-hidden="true" style={{ marginLeft: "0.25rem" }}>
					↓
				</span>
			);
		}
		return null;
	}

	return (
		<div className="webable-table">
			{/* Filter + page size controls */}
			<div className="webable-table__toolbar">
				<div className="webable-table__filter">
					<label className="webable-table__filter-label">
						<span className="webable-table__filter-text">Filter</span>
						<input
							type="text"
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							placeholder={filterPlaceholder}
							className="webable-table__filter-input"
						/>
					</label>
				</div>
				<div className="webable-table__page-size">
					<label className="webable-table__page-size-label">
						<span className="webable-table__page-size-text">Rows per page</span>
						<select
							value={pageSize}
							onChange={(e) => setPageSize(Number(e.target.value))}
							className="webable-table__page-size-select"
						>
							{pageSizeOptions.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</label>
				</div>
			</div>

			{/* Responsive wrapper */}
			<div className="webable-table__scroll">
				<table className="webable-table__table" aria-label={ariaLabel}>
					<thead className="webable-table__head">
						<tr>
							{columns.map((col) => {
								const isSorted = sortKey === col.key;
								const ariaSort: "ascending" | "descending" | "none" =
									!col.sortable
										? "none"
										: !isSorted || !sortDirection
											? "none"
											: sortDirection === "asc"
												? "ascending"
												: "descending";

								return (
									<th
										key={String(col.key)}
										className="webable-table__header-cell"
										aria-sort={ariaSort}
									>
										<button
											type="button"
											className={
												"webable-table__header-button" +
												(col.sortable
													? " webable-table__header-button--sortable"
													: "")
											}
											onClick={() => handleSort(col)}
										>
											<span>{col.header}</span>
											{renderSortIndicator(col)}
										</button>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody className="webable-table__body">
						{paginatedData.length === 0 ? (
							<tr>
								<td
									className="webable-table__empty-cell"
									colSpan={columns.length}
								>
									No data to display.
								</td>
							</tr>
						) : (
							paginatedData.map((row, rowIndex) => (
								<tr key={rowIndex} className="webable-table__row">
									{columns.map((col) => {
										const key = col.key as keyof T;
										const value = row[key];
										return (
											<td key={String(col.key)} className="webable-table__cell">
												{col.render
													? col.render(value, row)
													: String(value ?? "")}
											</td>
										);
									})}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination controls */}
			<div className="webable-table__pagination">
				<div className="webable-table__pagination-info">
					<span>
						Page {currentPageIndex + 1} of {pageCount}
					</span>
					<span>
						&nbsp;| {sortedData.length} row
						{sortedData.length === 1 ? "" : "s"}
					</span>
				</div>
				<div className="webable-table__pagination-controls">
					<button
						type="button"
						onClick={() => setPageIndex(0)}
						disabled={currentPageIndex === 0}
						className="webable-table__page-button"
					>
						« First
					</button>
					<button
						type="button"
						onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
						disabled={currentPageIndex === 0}
						className="webable-table__page-button"
					>
						‹ Prev
					</button>
					<button
						type="button"
						onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
						disabled={currentPageIndex >= pageCount - 1}
						className="webable-table__page-button"
					>
						Next ›
					</button>
					<button
						type="button"
						onClick={() => setPageIndex(pageCount - 1)}
						disabled={currentPageIndex >= pageCount - 1}
						className="webable-table__page-button"
					>
						Last »
					</button>
				</div>
			</div>
		</div>
	);
}
