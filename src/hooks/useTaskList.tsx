import { DataObject, DataArray, STask } from "obsidian-dataview";

export default function useTaskList(pages: DataArray<DataObject>) {
	const tasks = pages?.file?.tasks;
	const completedTasks = tasks?.filter((t: STask) => t.completed);
	const progress = Math.round(
		(completedTasks?.length / tasks?.length || 0) * 100
	);
	// grouping
	const rTasks = tasks?.filter((t: STask) => !t.completed);

	let elements: Map<string, STask> = new Map()
    // List all elements & their children in the lookup map.
    for (let elem of rTasks) enumerateChildren(elem, elements);

	const groupTasks = rTasks?.values
		.filter((task: STask) => {
				return task.parent == undefined || task.parent == null || !elements.has(parentListId(task))
		}).reduce(
			(group: Array<STask>, task: STask) => {
				const { path } = task;
				const link = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf(".md"));
				if (group[link]) {
					group[link].push(task);
				} else group[link] = [task];
				return group;
			},
			{}
		);

	return { tasks, progress, rTasks, groupTasks };
}

/** Compute a map of all task IDs -> tasks. */
function enumerateChildren(item: STask, output: Map<string, STask>): Map<string, STask> {
    if (!output.has(listId(item))) output.set(listId(item), item);
    for (let child of item.children) enumerateChildren(child, output);

    return output;
}

/////////////////////////
// Task De-Duplication //
/////////////////////////

function listId(item: STask): string {
    return item.path + ":" + item.line;
}

function parentListId(item: STask): string {
    return item.path + ":" + item.parent;
}
