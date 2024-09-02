import { getRealFile } from "Utils/getFileRealLink";
import { usePlugin } from "context/PluginContext";
import { filter, pageData, sort } from "interface/pageData";
import { parseYaml } from "obsidian";

export default function inputValidation(source: string, type?: string): pageData {
	try {
		const input = parseYaml(source);
		const [pages, where] = handlePage(input.pages, type);
		const [rows, showRows] = handleRows(input.rows);
		const data = {
			pages: pages,
			where: where,
			rows: rows,
			showRows: showRows,
			selectedValue: input.selectedValue ?? 10,
			selectedArr: handleSelectedArrValue(input.selectedValue),
			filter: handleFilter(input.filter, type),
			filterDefault: handleFilterDefault(input.filter, input.filterDefault, type),
			filterList: input.filterList || null,
			sort: handleSort(input.sort, type),
			selectedSortValue: input.sortDefault ?? 0,
			header: input.header || null,
			options: input.options || [],
			cls: input.cls || ""
		};
		return data;
	} catch (error) {
		throw new Error("작성된 쿼리에서 오류가 발생했습니다.");
	}
}

function handlePage(pages: string, type?: string): [string, string | undefined] {
	if (type) {
		return [getRealFile(pages).path, undefined];
	}

	let where;
	if (pages.match(/\bWHERE\b/i)) {
		const item = pages.split(/\bWHERE\b/i);
		pages = item[0].trim();
		where = item[1].trim();
	}

    if (!pages.startsWith("#")) {
        const filePath = this.app.workspace.getActiveFile();
        const parent = filePath?.parent;
        if (pages.startsWith("../") || pages.startsWith("\"../")) {
            const grandParent = parent?.parent?.path;
            pages = replacePath(pages, "../", grandParent);
        } else if (pages.startsWith("./") || pages.startsWith("\"./")) {
            const parentPath = parent?.path;
            pages = replacePath(pages, "./", parentPath);
        } else {
            pages = `"${pages}"`;
        }
    }

	const plugin = usePlugin();
	if (plugin.settings.FolderToExclude !== "") {
		pages = pages + ` and -"${plugin.settings.FolderToExclude}"`;
	}
    return [ pages, where ];
}
function handleRows(inputRows: string[]): [string[], string[]] {
	const rows: string[] = [];
	const showRows: string[] = [];
	inputRows.forEach((row) => {
		if (row.match(/\bAS\b/i)) {
			const item = row.split(/\bAS\b/i);
			rows.push(item[0].trim());
			showRows.push(item[1].trim());
		} else {
			rows.push(row);
			showRows.push(row);
		}
	});
	return [rows, showRows];
}
function replacePath(value: string, replaceWord: string, path: string) {
    const sliceValue = value.split(" ");
    const endString = (sliceValue[0]?.endsWith("/")) ? "" : "/";
    const result = sliceValue[0].replace(replaceWord, !(path === "/") ? (path + endString): "");
    value = value.replace(sliceValue[0], sliceValue[0].startsWith("\"")? result : `"${result}"`);
    return value;
}


function handleSelectedArrValue(selectedValue: number | null) {
	const selectedArr = [5, 10, 20, 30, 40, 50];

	if (selectedValue && !selectedArr.includes(selectedValue)) {
		selectedArr.push(selectedValue);
		selectedArr.sort((a, b) => a - b);
	}

	return selectedArr;
}

function handleFilter(filter: filter[] | null, type?: string) {
	if (type) return [];
	const filterArr: filter[] = [];
	if (filter) {
		filterArr.push({ label: "모두보기" }, ...filter);
	}
	return filterArr;
}

function handleFilterDefault(filter: filter[] | null, inputFilterDefault: string[] | null, type?: string) {
	if (type) return [];

	const filterDefault: number[] = [];
	if (filter && inputFilterDefault) {
		filter.forEach((item, index: number) => {
			// 기본적으로 사용하는 필터 추출
			if (inputFilterDefault.some((b :string) => b === item.label)) {
				filterDefault.push(index + 1);
			}
		})
	}
	return filterDefault;
}

function handleSort(sort: sort[] | null, type?: string) {
	let sortList: sort[]
	if (type) {
		sortList = [
			{
				label: "작성순 (알파벳 순)",
				type: "csv",
				sort: "desc",
			},
			{
				label: "작성순 (알파벳 역순)",
				type: "csv",
				sort: "asc",
			},
		];
	} else {
		sortList = [
			{
				label: "생성일순 (최신순)",
				type: "created",
				sort: "desc",
			},
			{
				label: "생성일순 (오래된순)",
				type: "created",
				sort: "asc",
			},
			{
				label: "업데이트일순 (최신순)",
				type: "file.mtime",
				sort: "desc",
			},
			{
				label: "업데이트일순 (오래된순)",
				type: "file.mtime",
				sort: "asc",
			},
			{
				label: "파일이름 (알파벳순)",
				type: "file.name",
				sort: "asc",
			},
			{
				label: "파일이름 (알파벳 역순)",
				type: "file.name",
				sort: "desc",
			},
		];
	}
	if (sort) sortList.push(...sort);

	return sortList;
}