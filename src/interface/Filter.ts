

export default interface Filter {
	"label": string;
	"class"?: string;
	"type"?: "tags" | "property" | "file.tags" | "file.name" | "file.aliases" | "file.link" | "file.inlinks" | "file.outlinks";
	"target"?: string;
	"target_content"?: string;
	"target_isInclude"?: string;
}
