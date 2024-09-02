import getDataviewAPI from "API/Dataview";
import { Literal, Link } from "obsidian-dataview";
import { getFileRealLink } from "Utils/getFileRealLink";
import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
import { MarkdownRenderer } from "obsidian";
import { usePlugin } from "context/PluginContext";
import { renderMinimalDate, currentLocale, renderMinimalDuration, getRelativeTime } from "../../Utils/renderDate";
import dvType from "Utils/dvType";

function RawMarkdown({ sourcePath, content, inline = true, cls }: {
    content: string;
	sourcePath: string;
    inline?: boolean;
    cls?: string;
}) {
    const container = useRef<HTMLElement | null>(null);
	const plugin = usePlugin();

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = "";

		MarkdownRenderer.render(plugin.app, content, container.current, sourcePath, plugin).then(() => {
			if (!container.current || !inline) return;

            // Unwrap any created paragraph elements if we are inline.
            let paragraph = container.current.querySelector("p");
            while (paragraph) {
                const children = paragraph.childNodes;
                paragraph.replaceWith(...Array.from(children));
                paragraph = container.current.querySelector("p");
            }
		})
    }, [content, sourcePath, container.current]);

    return <span ref={container} className={cls}></span>;
}

export const Markdown = React.memo(RawMarkdown);

function RawEmbedHtml({ element, cls }: { element: HTMLElement; cls?: string }) {
    const container = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = "";
        container.current.appendChild(element);
    }, [container.current, element]);

    return <span ref={container} className={cls}></span>;
}
export const EmbedHtml = React.memo(RawEmbedHtml);


function CheckForRaw({
	value,
	inline = true,
	sourcePath,
	relativeTime = false,
	cls
}: {
	value: Literal;
	inline: boolean;
	sourcePath: string;
	relativeTime?: boolean;
	cls?: string;
}) {
	const dv = getDataviewAPI();

	switch (dvType(value)) {
		case "string":
			return <Markdown content={value} sourcePath={sourcePath} />;
		case "number":
		case "boolean":
			return <>{"" + value}</>;
		case "date":
			return (
				<>
					{relativeTime
						? getRelativeTime(value, dv.settings, currentLocale())
						: renderMinimalDate(value, dv.settings, currentLocale())}
				</>
			);
		case "duration":
			return <>{renderMinimalDuration(value)}</>;
		case "link":
			return <Markdown content={value.markdown()} sourcePath={sourcePath} cls={cls} />;
		case "link_img":
			return (
				<span className={cls}>
					<img src={getFileRealLink(value.path)}></img>
				</span>
			);
		case "html":
			return <EmbedHtml element={value} cls={cls} />;
		case "widget":
			return <b>&lt;unknown widget '{value.$widget}'&gt;</b>;
		case "widget_list":
			return (
				<>
					<CheckRawList value={value.key} sourcePath={sourcePath} inline={inline} />:{" "}
					<CheckRawList value={value.value} sourcePath={sourcePath} inline={inline} />
				</>
			);
		case "widget_externalLink":
			return (
				<a
					href={value.url}
					rel="noopener"
					target="_blank"
					className={`external-link ${cls}`}
				>
					{value.display ?? value.url}
				</a>
			);
		case "function":
			return <Fragment>&lt;function&gt;</Fragment>;
		case "array":
			if (!inline) {
				return (
					<ul className={`dataview dataview-ul dataview-result-list-ul ${cls}`}>
						{value.map((subValue: Literal, index: number) => (
							<li className="dataview-result-list-li"  key={"key" + String(subValue) + index} >
								<CheckRawList value={subValue} sourcePath={sourcePath} inline={inline} />
							</li>
						))}
					</ul>
				);
			} else {
				if (value.length == 0) return <Fragment>&lt;Empty List&gt;</Fragment>;
	
				return (
					<span className={`dataview dataview-result-list-span ${cls}`}>
						{value.map((subValue: Literal, index: number) => (
							<Fragment key={"subValue" + String(subValue) + index}>
								{index === 0 ? "" : ", "}
								<CheckRawList value={subValue} sourcePath={sourcePath} inline={inline} />
							</Fragment>
						))}
					</span>
				);
			}
		case "object":
			if (value?.constructor?.name && value?.constructor?.name != "Object") {
				return <>&lt;{value.constructor.name}&gt;</>;
			}
			if (!inline) {
				return (
					<ul className={`dataview dataview-ul dataview-result-object-ul ${cls}`}>
						{Object.entries(value).map(([key, value], index) => (
							<li className="dataview dataview-li dataview-result-object-li" key={"key" + key + index} >
								{key}: <CheckRawList value={value} sourcePath={sourcePath} inline={inline} />
							</li>
						))}
					</ul>
				);
			} else {
				if (Object.keys(value).length == 0) return <Fragment>&lt;Empty Object&gt;</Fragment>;
				return (
					<span className={`dataview dataview-result-object-span ${cls}`}>
						{Object.entries(value).map(([key, value], index) => (
							<Fragment key={"dataview" + String(key) + index}>
								{index == 0 ? "" : ", "}
								{key}: <CheckRawList value={value} sourcePath={sourcePath} inline={inline} />
							</Fragment>
						))}
					</span>
				);
			}
		default:
			return <>{dv.settings.renderNullAs}</>;
	}
	
}

export const CheckRawList = React.memo(CheckForRaw);

const IMAGE_EXTENSIONS = Object.freeze(
	new Set([
		".tif",
		".tiff",
		".gif",
		".png",
		".apng",
		".avif",
		".jpg",
		".jpeg",
		".jfif",
		".pjepg",
		".pjp",
		".svg",
		".webp",
		".bmp",
		".ico",
		".cur",
	])
);

export function isImageEmbed(link: Link): boolean {
	if (!link.path.contains(".")) return false;

	const extension = link.path.substring(link.path.lastIndexOf("."));
	return link.type == "file" && link.embed && IMAGE_EXTENSIONS.has(extension);
}


