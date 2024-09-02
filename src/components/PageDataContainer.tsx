import { pageData } from "interface/pageData";
import Observer from "./table/Observer";
import Table from "./table/Table";
import { DataArray, DataObject } from "obsidian-dataview";
import { usePage } from "hooks/usePage";
import AppliedFilter from "./toolbar/AppliedFilter";
import FilterList from "./toolbar/menu/FilterList";
import SortBtn from "./toolbar/menu/SortBtn";
import Filter from "./toolbar/menu/Filter";
import Search from "./toolbar/Search";
import Pagination from "./toolbar/Pagination";
import Select from "./toolbar/Select";
import { PagesDataContext } from "context/PagesDataContext";
import TasksListWrap from "./TasksListWrap";


export default function PageDataContainer({
	input,
	pages,
	sourcePath,
}: {
	input: pageData;
	pages: DataArray<DataObject>;
	sourcePath: string;
}) {
	const pageData = usePage(pages, input);
	
	return (
		<div className={input.cls}>
			{input.header && (
				<h2 className="HyperMD-header HyperMD-header-2">
					<span className="cm-header cm-header-2">
						{input.header}
					</span>
				</h2>
			)}
			<PagesDataContext.Provider value={pageData}>
				<div className="toolbarContainer">
					<div className="toolbar">
						{!input.options.includes("noPagination") ? (
							<div className="toolbar-left">
								<Select />
								<Pagination />
							</div>
						): input.filterList &&
						input.filterList.length !== 0 && (
							<div className="filter-list-container">
								{input.filterList.map((item, index) => (
									<FilterList
										key={index}
										pages={pages}
										property={item}
									/>
								))}
							</div>
						)}
						<div className="toolbar-right">
							<Search />
							{input.filter && input.filter.length !== 0 && (
								<Filter filter={input.filter} />
							)}
							<SortBtn sort={input.sort} />
						</div>
					</div>
					<div className="filter-showing-box">
						{!input.options.includes("noPagination") &&
							input.filterList &&
							input.filterList.length !== 0 && (
								<div className="filter-list-container">
									{input.filterList.map((item, index) => (
										<FilterList
											key={index}
											pages={pages}
											property={item}
										/>
									))}
								</div>
							)}
						{input.filter && (
							<AppliedFilter filter={input.filter} />
						)}
					</div>
				</div>
			</PagesDataContext.Provider>
			<Table
				pages={pageData.pageSlice()}
				rows={input.rows}
				showRows={input.showRows}
				sourcePath={sourcePath}
			/>
			{input.options.includes("noPagination") && (pageData.rendererPages.length > pageData.viewListNum) && (
				<Observer
					selectedValue={input.selectedValue}
					setViewListNum={pageData.setViewListNum}
				/>
			)}
			{input.options.includes("tasksView") && pages.length !== 0 && (
				<TasksListWrap pages={pages} />
			)}
		</div>
	);
}
