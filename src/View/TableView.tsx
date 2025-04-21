import PageContent from "components/Content/PageContent";
import { useControl } from "context/ControlContext";
import { DataArray, DataObject } from "obsidian-dataview";

export default function TableView({
    pages,
	sourcePath,
}: {
	pages: DataArray<DataObject>;
    sourcePath: string;
}) {
    const { state } = useControl(); 
    const pageSlice = () => {
		const start = (state.currentPageNum - 1) * state.query.viewListCount;
		const end =
			(state.currentPageNum - 1) * state.query.viewListCount +
			state.query.viewListCount;
		return pages.slice(start, end);
	};

    return (
        <div className="page-table-wrapper">
            <table>
                <thead>
                    <tr>
                        {state.query.rows.map((row: string, index) => (
                            <th key={index}>{row}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {pageSlice().map((page: DataObject, index: number) => (
                        <tr key={"tr" + index}>
                            {state.query.rows.map((row: string, index) => (
                                <td key={"td" + index}>
                                    <PageContent
                                        page={page}
                                        row={row}
                                        sourcePath={sourcePath}
                                    ></PageContent>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
