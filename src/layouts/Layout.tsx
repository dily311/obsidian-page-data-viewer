import { DataArray, DataObject } from "obsidian-dataview";
import TableView from "./tableView";
import BoardView from "./boardView";
import CardView from "./cardView";
import CalenderView from "./calenderView";
import GalleryView from "./galleryView";

export default function Layout({
    layout,
    pages,
    rows,
    showRows,
    sourcePath
}: {
    layout: string;
    pages: DataArray<DataObject>;
    rows: string[];
    showRows: string[];
	sourcePath: string;
}) {
    switch (layout) {
        case "table":
            return (
                <TableView
                    pages={pages}
                    rows={rows}
                    showRows={showRows}
                    sourcePath={sourcePath}
                />
            )
        case "card":
            return (
                <CardView />
            )
        case "board":
            return (
                <BoardView />
            )
        case "calender":
            return (
                <CalenderView />
            )
        case "chart":
            return (
                <CardView />
            )
        case "gallery":
            return (
                <GalleryView />
            )
    }
}
