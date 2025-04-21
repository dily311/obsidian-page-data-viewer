import { DateTime } from "luxon";
import { useState } from "react";
import Calendar from "components/Content/Calendar";
import { DataArray, DataObject } from "obsidian-dataview";
import PageContent from "components/Content/PageContent";

export default function CalendarView({
	pages,
	sourcePath
}: {
	pages: DataArray<DataObject>;
	sourcePath: string;
}) {

	const now = DateTime.now();
	const [selectedDate, setSelectedDate] = useState(
		DateTime.local(now.year, now.month, now.day)
	);

	const pagesGroups = pages.groupBy((page: DataObject) => page.file.ctime);
	console.log(pagesGroups);

	pages = pages.filter((page: DataObject) => {
		const ctime: DateTime = page.file.ctime;
		const mtime: DateTime = page.file.mtime;
	
		return (ctime.year === selectedDate.year && ctime.month === selectedDate.month  && ctime.day === selectedDate.day)
				|| (mtime.year === selectedDate.year && mtime.month === selectedDate.month  && mtime.day === selectedDate.day);
	});
	
	const rows = ["file.ctime", "file.mtime"];

	return (
		<>
			<div className="calendarView">
				<Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
				<ul>
					{pages.map((page: DataObject, index:number) => (
						<li key={index}>
							<PageContent page={page} row="file.link" sourcePath={sourcePath} />
							<ul>
								{rows.map((row, index) => (
									<li key={row+index}>
										{row + ": "} 
										<PageContent page={page} row={row} sourcePath={sourcePath} />
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}

