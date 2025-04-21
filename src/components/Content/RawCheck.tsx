import getDataviewAPI from "api/dataview";
import { usePlugin } from "context/PluginContext";
import { MarkdownRenderer } from "obsidian";
import React, { useRef, useEffect, Fragment } from "react";
import { DateTime, Literal } from "obsidian-dataview";

function RawMdRender({
	content, sourcePath, inline = true, cls,
}: {
	content: string;
	sourcePath: string;
	inline?: boolean;
	cls?: string;
}) {
	const plugin = usePlugin();
	const container = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!container.current) return;
		container.current.innerHTML = "";

		MarkdownRenderer.render(plugin.app, content, container.current, sourcePath, plugin);
	}, [content, sourcePath, container.current]);

	return <span ref={container} className={cls}></span>;
}

export const Markdown = React.memo(RawMdRender);

function RawEmbedHtml({ element, cls }: { element: HTMLElement; cls?: string; }) {
	const container = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!container.current) return;
		container.current.innerHTML = "";
		container.current.appendChild(element);
	}, [container.current, element]);

	return <span ref={container} className={cls}></span>;
}

export const EmbedHtml = React.memo(RawEmbedHtml);

function RawCheck({
	value, inline = true, sourcePath, cls,
}: {
	value: Literal;
	inline: boolean;
	sourcePath: string;
	cls?: string;
}) {
	const dv = getDataviewAPI();

	if (dv.value.isNull(value)) {
		return <>{dv.settings.renderNullAs}</>;
	} else if (dv.value.isString(value)) {
		return <Markdown content={value} sourcePath={sourcePath} />;
	} else if (dv.value.isNumber(value)) {
		return <>{value}</>;
	} else if (dv.value.isBoolean(value)) {
		return <input checked={value}></input>;
	} else if (dv.value.isLink(value)) {
		return <Markdown content={value.markdown()} sourcePath={sourcePath} />;
	} else if (dv.value.isDate(value)) {
		return (
			<>
				{renderDate(value)}
			</>
		);
	} else if (dv.value.isDuration(value)) {
		return <>Duration</>;
	} else if (dv.value.isWidget(value)) {
		if (dv.widgets.isListPair(value)) {
			return (
				<>
					<RawCheckList value={value.key} sourcePath={sourcePath} inline={inline} />:{" "}
					<RawCheckList value={value.value} sourcePath={sourcePath} inline={inline} />
				</>
			);
		} else if (dv.widgets.isExternalLink(value)) {
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
		}
		return <b>&lt;unknown widget '{value.$widget}'&gt;</b>;
	} else if (dv.value.isArray(value)) {
		if (value.length == 0) return <>{dv.settings.renderNullAs}</>;
		if (!inline) {
			return (
				<ul className="array">
					{value.map((sub: Literal, index: number) => (
						<li key={"arrayKey" + String(sub) + index}>
                            <RawCheckList value={sub} sourcePath={sourcePath} inline={inline} />
                        </li>
                    ))}
				</ul>
			);
		}
		return (
			<span>
				{value.map((sub: Literal, index: number) => (
					<Fragment key={"subValue" + String(sub) + index}>
						{index === 0 ? "" : ", "}
						<RawCheckList value={sub} sourcePath={sourcePath} inline={inline} />
					</Fragment>
				))}
			</span>
		);
	} else if (dv.value.isHtml(value)) {
		return <EmbedHtml element={value} />;
	} else if (dv.value.isFunction(value)) {
		return <>function</>;
	} else if (dv.value.isObject(value)) {
		if (value?.constructor?.name && value?.constructor?.name != "Object") {
			return <>&lt;{value.constructor.name}&gt;</>;
		}
		if (!inline) {
			return (
				<ul>
					{Object.entries(value).map(([key, value], index) => (
						<li key={"key" + key + index}>
							{key}: <RawCheckList value={value} sourcePath={sourcePath} inline={inline} />
						</li>
					))}
				</ul>
			);
		} else {
			if (Object.keys(value).length == 0) return <Fragment>&lt;Empty Object&gt;</Fragment>;
			return (
				<span>
					{Object.entries(value).map(([key, value], index) => (
						<Fragment key={"dataview" + String(key) + index}>
							{index == 0 ? "" : ", "}
							{key}: <RawCheckList value={value} sourcePath={sourcePath} inline={inline} />
						</Fragment>
					))}
				</span>
			);
		}

	}

	return <>{dv.settings.renderNullAs}</>;
}

export const RawCheckList = React.memo(RawCheck);

function renderDate(date: DateTime) {
	return date.toFormat("DD");
}