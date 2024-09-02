import CircleProgress from "components/CircleProgress";
import { Markdown } from "components/table/CheckRawList";
import { usePlugin } from "context/PluginContext";
import useTaskList from "hooks/useTaskList";
import { Platform, Vault } from "obsidian";
import { DataArray, DataObject, STask } from "obsidian-dataview";
import React, { useState } from "react";

export default function TasksListWrap({ pages }: { pages: DataArray<DataObject>; }) {
	const { tasks, rTasks, progress, groupTasks } = useTaskList(pages);

	return (
		<div className="tasksListWrap">
			<CircleProgress
				progressWidth={120}
				strokeWidth={5}
				progress={progress} />
			<div className="taskList">
				<h4>
					<span>Task List</span>
					<span className="dataview small-text">{rTasks.length}</span>
				</h4>
				<div>
					{tasks.length === 0 ? (
						<p>No tasks</p>
					) : (
						rTasks.length === 0 && <p>할 일을 모두 마쳤습니다.</p>
					)}
				</div>
				{Object.values(groupTasks).map((tasks: STask, index: number) => (
					<React.Fragment key={"tasksList" + index}>
						{pages?.length > 1 ? (
							<TaskDetails tasks={tasks} title={Object.keys(groupTasks)[index]} />
						) : (
							<TaskList tasks={tasks} />
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

function TaskDetails({ tasks, title }: { tasks: STask; title: string; }) {
	const [open, setOpen] = useState(false);
	return (
		<details onClick={(e) => e.preventDefault()} {...open ?{open: true}: {}}>
			<summary onClick={() => setOpen(!open)}>
				<span>{title}</span>
				<span className="dataview small-text">
					{tasks.length}
				</span>
			</summary>
			<TaskList tasks={tasks} />
		</details>
	);
}
function TaskList({ tasks }: { tasks: STask; }) {
	return (
		<ul className={"contains-task-list"}>
			{tasks.map((task: STask, index: number) => (
				<Tasks key={"task" + index} task={task} />
			))}
		</ul>
	);
}
function Tasks({ task }: { task: STask; }) {
	const plugin = usePlugin();

	const handleClick = (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		if (wasLinkPressed(evt)) {
			return;
		}

		evt.stopPropagation();
		const selectionState = {
			eState: {
				cursor: {
					from: { line: task.line, ch: task.position.start.col },
					to: {
						line: task.line + task.lineCount - 1,
						ch: task.position.end.col,
					},
				},
				line: task.line,
			},
		};
		plugin.app.workspace.openLinkText(
			task.link.toFile().obsidianLink(),
			task.path,
			evt.ctrlKey || (evt.metaKey && Platform.isMacOS),
			selectionState as any
		);
	};
	const handleChecked = (
		evt: React.MouseEvent<HTMLInputElement, MouseEvent>
	) => {
		evt.stopPropagation();
		const completed = evt.currentTarget.checked;
		const status = completed ? "x" : " ";
		// Update data-task on the parent element (css style)
		const parent = evt.currentTarget.parentElement;
		parent?.setAttribute("data-task", status);

		rewriteTask(plugin.app.vault, task, status, task.text);
	};
	return (
		<li
			className={"dataview" + (task.task ? " task-list-item": " task-list-basic-item") + (task.checked ? " is-checked" : "")}
			data-task={task.status}
			onClick={handleClick}
		>
			{task.task && 
				<input
					type="checkbox"
					defaultChecked={task.checked}
					className="dataview task-list-item-checkbox"
					onClick={handleChecked}
				></input>
			}
			<Markdown
				inline={true}
				content={task.visual ?? task.text}
				sourcePath={task.path} />
			{task.children.length > 0 && <TaskList tasks={task.children}/>}
		</li>
	);
}
function wasLinkPressed(
	evt: React.MouseEvent<HTMLLIElement, MouseEvent>
): boolean {
	return (
		evt.target != null &&
		evt.target != undefined &&
		(evt.target as HTMLElement).tagName == "A"
	);
}
const LIST_ITEM_REGEX = /^[\s>]*(\d+\.|\d+\)|\*|-|\+)\s*(\[.{0,1}\])?\s*(.*)$/mu;
/** Rewrite a task with the given completion status and new text. */

async function rewriteTask(
	vault: Vault,
	task: STask,
	desiredStatus: string,
	desiredText?: string
) {
	if (desiredStatus == task.status &&
		(desiredText == undefined || desiredText == task.text))
		return;
	desiredStatus = desiredStatus == "" ? " " : desiredStatus;

	const rawFiletext = await vault.adapter.read(task.path);
	const hasRN = rawFiletext.contains("\r");
	const filetext = rawFiletext.split(/\r?\n/u);

	if (filetext.length < task.line) return;
	const match = LIST_ITEM_REGEX.exec(filetext[task.line]);
	if (!match || match[2].length == 0) return;

	const taskTextParts = task.text.split("\n");
	if (taskTextParts[0].trim() != match[3].trim()) return;

	// We have a positive match here at this point, so go ahead and do the rewrite of the status.
	const initialSpacing = /^[\s>]*/u.exec(filetext[task.line])!![0];
	if (desiredText) {
		const desiredParts = desiredText.split("\n");

		const newTextLines: string[] = [
			`${initialSpacing}${task.symbol} [${desiredStatus}] ${desiredParts[0]}`,
		].concat(desiredParts.slice(1).map((l) => initialSpacing + "\t" + l));

		filetext.splice(task.line, task.lineCount, ...newTextLines);
	} else {
		filetext[task.line] = `${initialSpacing}${task.symbol} [${desiredStatus}] ${taskTextParts[0].trim()}`;
	}

	const newText = filetext.join(hasRN ? "\r\n" : "\n");
	await vault.adapter.write(task.path, newText);
}
