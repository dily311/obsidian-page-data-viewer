import React, { useState } from 'react';
import { getFileRealLink } from 'Utils/getFileRealLink';
import { CheckRawList, Markdown } from "./CheckRawList";
import { isImageEmbed } from "./CheckRawList";
import { DataObject, STask } from "obsidian-dataview";

export default React.memo(CheckTableData);

function CheckTableData({
	page,
	row,
	sourcePath,
}: {
	page: DataObject;
	row: string;
	sourcePath: string;
}) {
	if (row === "cover_url") {
		return <PageCoverUrl page={page} />
	} 
	let cls: string | undefined;
	const options = (txt: string) => {
		const contains = row.contains(txt);
		if (contains) row = row.replace(txt, "");
		return contains;
	}
	const relativeTime = options("rTime_");
	const embed = options("embed_");
	const isOpen = options("open_");

	if (row.contains("file.")) {
		row = row.replace("file.", "").trim();
		const file = page.file[row];
		switch (row) {
			case "tasks":
				if (file.length !== 0) {
					const completedTasks = file.filter((t: STask) => t.completed);
					const progress = Math.round(
						(completedTasks.length / file.length || 0) * 100
					);
	
					return (
						<span>
							<progress value={progress} max="100"></progress>
							&nbsp;
							<span>{progress}%</span>
						</span>
					);
				} else {
					return <span>No tasks</span>;
				}
			case "name":
			case "link":
				if (embed) {
					const css = page["cssclasses"];
					cls = "embed-file";
					if (css && css?.length !== 0) {
						css.forEach((css: string) => cls += ` ${css}`);
					}
					return (
						<EmbedPage
							content={String(file)}
							sourcePath={sourcePath}
							isOpen={isOpen}
							cls={cls}
						/>
					);
				}
				cls = "file-title";
		}
		return (
			<CheckRawList
				value={file}
				sourcePath={sourcePath}
				inline={false}
				relativeTime={relativeTime}
				cls={cls}
			/>
		);
	}

	return <CheckRawList value={page[row]} sourcePath={sourcePath} inline={false} relativeTime={relativeTime} />;
}

function EmbedPage({content, sourcePath, isOpen, cls}: {content: string; sourcePath: string; isOpen: boolean; cls: string;}) {
	const [open, setOpen] = useState(isOpen);
	return (
		<details
			onClick={(e) => e.preventDefault()}
			{...(open ? { open: true } : { })}
			className={cls}
		>
			<summary className="file-title" onClick={() => setOpen(!open)}>
				세부정보
			</summary>
			<Markdown content={`!${content}`} sourcePath={sourcePath} />
		</details>
	);
}

function PageCoverUrl({page}:{page: DataObject}) {
	let src = "";

	switch (typeof page.cover_url) {
		case "string":
			// 페이지 cover_url이 웹 이미지를 불러오는 형식이라면
			src = page.cover_url;
			break;
		case "object":
			// 페이지 cover_url이 옵시디언 내부 이미지를 불러오는 방식이라면
			src = getFileRealLink(page.cover_url.path);
			break;
		default:
			// page가 null인 경우, 문서 내부의 첫번째 이미지에서 불러오기
			for (const item of page.file.outlinks.values) {
				if (isImageEmbed(item)) {
					if (String(item.path).startsWith("http")) {
						src = item.path;
					} else {
						src = getFileRealLink(item.path);
					}
					break;
				}
			}
	}

	return (
		<>
			{src !== "" && (
				<a
					data-tooltip-position="top"
					aria-label={page.file.name}
					data-href={page.file.name}
					href={page.file.link.path}
					className="internal-link"
					target="_blank"
					rel="noopener"
				>
					<img src={src} />
				</a>
			)}
		</>
	);
}
