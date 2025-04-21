import { DataObject } from "obsidian-dataview";
import { Markdown, RawCheckList } from "./RawCheck";

export default function PageContent({
	page,
	row,
	sourcePath,
}: {
	page: DataObject;
	row: string;
	sourcePath: string;
}) {
	
	switch (row) {
		case "cover_url":
			return null;
		case "title":
			return <RawCheckList value={page.file.link} sourcePath={sourcePath} inline={false} />
		case "tags":
			return <RawCheckList value={page.file.tags} sourcePath={sourcePath} inline={true} />
		case "embed":
			return <Markdown content={`![[${page.file.name}]]`} sourcePath={sourcePath} inline={false} />
	}

	if (row.contains("file.")) {
		row = row.replace("file.", "").trim();
		const value = page.file[row];

		return <RawCheckList value={value} sourcePath={sourcePath} inline={false} />
	}

	return <RawCheckList value={page[row]} sourcePath={sourcePath} inline={false} />
}

