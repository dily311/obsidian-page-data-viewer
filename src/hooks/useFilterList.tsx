import { dvSettings } from 'API/Dataview';
import dvType from 'Utils/dvType';
import { linkFileToText } from 'Utils/getFileRealLink';
import { currentLocale, renderMinimalDate, renderMinimalDuration } from 'Utils/renderDate';
import { filterList } from 'interface/pageData';
import { Literal } from "obsidian-dataview";
import { DataArray, DataObject } from "obsidian-dataview";

export default function useFilterList(pages: DataArray<DataObject>, property: string) {
    const data = pages[property];
	const setList = new Set(data);
	const itemList: filterList[] = [{label: "모두보기", content: "", type: "default"}];
	Array.from(setList).forEach((item: Literal) => {
		const type = dvType(item);
		let label = "";
		switch (type) {
			case "link":
				label = linkFileToText(String(item.path));
				break;
			case "date":
				label = renderMinimalDate(item, dvSettings, currentLocale());
				break;
			case "duration":
				label = renderMinimalDuration(item);
				break;
			default:
				label = String(item);
		}

		itemList.push({
			content: String(item),
			label: label,
			type: type,
		});
	});

	const filterList = itemList.filter((obj, idx) => {
		const isFirstFindIdx = itemList.findIndex((obj2) => obj2.label === obj.label);
		return isFirstFindIdx === idx;
	}).sort((a,b) => {
		if (a.label === "모두보기" || b.label === "모두보기") return 0;
		if(a.content > b.content) return -1;
		if(a.content < b.content) return 1;
		return 0;
	});

    return [filterList];
}
