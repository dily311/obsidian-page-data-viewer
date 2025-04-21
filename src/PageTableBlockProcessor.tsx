import { useReducer, useState } from "react";
import Loading from "./components/Loading";
import QueryType from "interface/QueryData";
import { usePlugin } from "context/PluginContext";
import { DataArray, DataObject } from "obsidian-dataview";
import { ControlContext, controlReducer, createInitialState } from "context/ControlContext";
import TableView from "View/TableView";
import ToolBar from "components/ToolBar/ToolBar";
import CalendarView from "View/CalenderView";

export default function PageTableBlockProcessor({
	query,
	sourcePath,
	isDataviewLoading,
	getDataviewPages,
}: {
	query: QueryType;
	sourcePath: string;
	isDataviewLoading: boolean;
	getDataviewPages: () => DataArray<DataObject>;
}) {
	const plugin = usePlugin();

	const [isLoading, setIsLoading] = useState(!isDataviewLoading);
	const [pages, setPages] = useState(getDataviewPages);

	plugin.registerEvent(
		plugin.app.metadataCache.on("dataview:index-ready", () => {
			if (isLoading) setIsLoading(false);
		})
	);
	plugin.registerEvent(
		plugin.app.metadataCache.on("dataview:metadata-change", () => {
			setPages(getDataviewPages);
		})
	);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<View pages={pages} query={query} sourcePath={sourcePath} />
			)}
		</>
	);
}

function View({
	query,
	pages,
	sourcePath,
}: {
	query: QueryType;
	pages: DataArray<DataObject>;
	sourcePath: string;
}) {
	const [state, dispatch] = useReducer(controlReducer, {query: query, pages: pages }, createInitialState);

	return (
		<ControlContext.Provider value={{ state, dispatch }}>
			<ToolBar></ToolBar>
			{query.layout == "table" && (
				<TableView pages={pages} sourcePath={sourcePath} />
			)}
			{query.layout == "cards" && (
				<></>
			)}
			{query.layout == "list" && (
				<></>
			)}
			{query.layout == "calendar" && (
				<CalendarView pages={pages} sourcePath={sourcePath} />
			)}
			{query.layout == "tasks" && (
				<></>
			)}
		</ControlContext.Provider>
	);
}

