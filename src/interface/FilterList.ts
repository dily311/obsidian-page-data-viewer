

export interface FilterList {
	content: string;
	label: string;
	type: "null" |
	"string" |
	"number" |
	"boolean" |
	"date" |
	"duration" |
	"link_img" |
	"link" |
	"html" |
	"widget_list" |
	"widget" |
	"widget_externalLink" |
	"function" |
	"array" |
	"object" |
	"default";
}
