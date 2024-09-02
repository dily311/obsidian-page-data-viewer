export interface pageData {
	readonly pages: string;
	readonly where?: string;
	readonly rows: Array<string>;
	readonly showRows: Array<string>;
	readonly selectedValue: number;
	readonly selectedArr: number[];
	readonly filter: filter[];
	readonly filterDefault: number[];
	readonly filterList?: string[];
	readonly sort: sort[];
	readonly selectedSortValue: number;
	readonly cls: string;
	readonly header?: string;
	readonly options: Array<string>;
}


export interface filter {
	"label": string;
	"class"?: string;
	"type"?: "tags" | "property" | "file.tags" | "file.name" | "file.aliases" | "file.link" | "file.inlinks" | "file.outlinks";
	"target"?: string;
	"target_content"?: string;
	"target_isInclude"?: string;
}

export interface filterList {
	content: string;
	label: string;
	type: 
	| "null"
	| "string"
	| "number"
    | "boolean"
	| "date"
	| "duration"
	| "link_img"
	| "link"
	| "html"
	| "widget_list"
	| "widget"
	| "widget_externalLink"
	| "function"
    | "array"
    | "object"
    | "default";
}
export interface sort {
	"label": string;
	"type": string;
	"sort": "desc" | "asc";
}