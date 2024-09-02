import getDataviewAPI from "API/Dataview";
import { Literal } from "obsidian-dataview";
import { isImageEmbed } from "components/table/CheckRawList";

export default function dvType(
	value: Literal
):
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
    | "default" {
	const dv = getDataviewAPI();
	if (dv.value.isNull(value) || value === undefined) {
		return "null";
	} else if (dv.value.isString(value) || typeof value === "string") {
		return "string";
	} else if (dv.value.isNumber(value)) {
		return "number";
    } else if (dv.value.isBoolean(value)) {
        return "boolean";
	} else if (dv.value.isDate(value)) {
		return "date";
	} else if (dv.value.isDuration(value)) {
		return "duration";
	} else if (dv.value.isLink(value)) {
		if (isImageEmbed(value)) {
			return "link_img";
		}
		return "link";
	} else if (dv.value.isHtml(value)) {
		return "html";
	} else if (dv.value.isWidget(value)) {
		if (dv.widgets.isListPair(value)) {
			return "widget_list";
		} else if (dv.widgets.isExternalLink(value)) {
			return "widget_externalLink";
		} else {
			return "widget";
		}
	} else if (dv.value.isFunction(value)) {
		return "function";
	} else if (dv.value.isArray(value)) {
		return "array";
	} else if (dv.value.isObject(value)) {
		return "object";
	}

	return "default";
}
