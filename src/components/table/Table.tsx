import CheckTableData from "./CheckTableData";
import { DataArray, DataObject } from "obsidian-dataview";

export default function Table({
	pages,
	rows,
	showRows,
	sourcePath,
}: {
	pages: DataArray<DataObject>;
	rows: string[];
	showRows: string[];
	sourcePath: string;
}) {
	return (
		<div className="page-table-wrapper">
			<table className="dataview table-view-table page-table-viewer">
				<thead className="table-view-thead">
					<tr className="table-view-tr-header">
						{showRows.map((row: string, index: number) => (
							<th
								className="table-view-th"
								key={"tableRow" + index}
							>
								{row}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="table-view-tbody">
					{pages.map((page: DataObject, index: number) => (
						<tr key={"tr" + index}>
							{rows.map((row, index: number) => (
								<td key={"td" + index}>
									<CheckTableData
										page={page}
										row={row}
										sourcePath={sourcePath}
									/>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			{pages.length === 0 && (
				<div className="dataview dataview-error-box">
					<p className="dataview dataview-error-message">
						Dataview: No results to show for table query.
					</p>
				</div>
			)}
		</div>
	);
}