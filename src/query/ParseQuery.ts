import Filter from "interface/Filter";
import QueryType, { LayoutType } from "interface/QueryData";
import Sort from "interface/Sort";
import { parseYaml, Platform } from "obsidian";
import { getRealFile } from "utils/getFileRealLink";


export default class ParseQuery {
    type: "pages" | "csv";
    source: string;
    sourcePath: string;

    constructor(source: string, sourcePath: string, type: "pages"| "csv") {
        this.source = source;
        this.sourcePath = sourcePath;
        this.type = type;
    }

    parse(): QueryType | void {
        try {
            const input = parseYaml(this.source);
            const [query, where] = this.parsePagesQuery(input.pages);
            const [rows, displayRows] = this.parseRows(input.rows);

            const result: QueryType = {
                type: this.type,
                layout: this.parseLayout(input.layout),
                query: query,
                where: where,

                rows: rows,
                displayRows: displayRows,

                viewBtnCount: input.viewBtnCount ?? ((Platform.isPhone)? 8 : 10),
                viewListCount: input.viewListCount ?? 10,
                viewSelectListCountArr: this.parseViewSelectListCountArr(input.selectedValue), // selectedValue
        
                filter: this.parseFilter(input.filter),
                filterDefault: this.parseFilterDefault(input.filter, input.filterDefault),
                filterList: input.filterList || null,
                        
                sort: this.parseSort(input.sort),
                sortSelectedValue: input.sortSelectedValue ?? 0,
        
                options: input.options || null,
            };
    
            return result;
        } catch (error) {
            console.log("파싱 중 오류", error);
        }
    }

    // tasks: 레이아웃 파서 함수 수정정
    private parseLayout(layout: string | null): LayoutType {
        switch (layout) {
            case "table": 
            case "cards": 
            case "list": 
            case "calendar":
                return layout;
        }
        return "table";
    }

    private parsePagesQuery(parsePagesQuery: string): [string, string | undefined] {
        if (this.type == "csv") {
            return [getRealFile(parsePagesQuery).path, undefined];
        }
    
        let where;
        if (parsePagesQuery.match(/\bWHERE\b/i)) {
            const item = parsePagesQuery.split(/\bWHERE\b/i);
            parsePagesQuery = item[0].trim();
            where = item[1].trim();
        }
    
        if (!parsePagesQuery.startsWith("#")) {
            parsePagesQuery = pagesReplacePath(parsePagesQuery);
        }
    
        return [ parsePagesQuery, where ];
    }

    private parseRows(parserRows: string[]): [string[], string[]] {
        const rows: string[] = [];
        const showRows: string[] = [];
        parserRows.forEach((row) => {
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

    private parseViewSelectListCountArr(viewSelectListCountArr: number | null) {
        const selectedCount = [5, 10, 20, 30, 40, 50];

        if (viewSelectListCountArr && !selectedCount.includes(viewSelectListCountArr)) {
            selectedCount.push(viewSelectListCountArr);
            selectedCount.sort((a, b) => a - b);
        }
    
        return selectedCount;
    }

    private parseFilter(filter: Filter[] | null): Filter[] {
        const filterArr: Filter[]  = [];
        if (filter && this.type != "csv") {
            filterArr.push({label: "모두보기"}, ...filter);
        }
        return filterArr
    }

    private parseFilterDefault(filter: Filter[] | null, parseFilterDefault: string[] | null): number[] {
        const result: number[] = [];
        if (!filter || !parseFilterDefault || (this.type == "csv")) return result;

        filter.forEach((item, index) => {
            if (parseFilterDefault.some((d: string) => d === item.label)) {
                result.push(index + 1);
            }
        })

        return result;
    }

    private parseSort(sort: Sort[]|null): Sort[] {
        const result: Sort[] = [];
        if (this.type != "csv") {
            result.push(
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
            );
        } else {
            result.push(
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
            )
        }

        if (sort) {
            result.push(...sort);
        }

        return result;
    }

}

function pagesReplacePath(value: string) {
    let replaceWord: string;
    let path: string;

    const filePath = this.app.workspace.getActiveFile();
    const parent = filePath?.parent;

    const sliceValue = value.split(" ");
    const endString = (sliceValue[0]?.endsWith("/")) ? "" : "/";

    if (value.startsWith("../") || value.startsWith("\"../")) {
        replaceWord = "../";
        path = parent?.parent?.path;
    } else if (value.startsWith("./") || value.startsWith("\"./")) {
        replaceWord = "./";
        path = parent?.path;
    } else {
        return `"${value}"`;
    }
    
    const result = sliceValue[0].replace(replaceWord, !(path === "/") ? (path + endString): "");
    value = value.replace(sliceValue[0], sliceValue[0].startsWith("\"")? result : `"${result}"`);
    return value;
}
