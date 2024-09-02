import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import CsvTableView from "view/CsvTableView";
import ReactView from "view/ReactView";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "components/ErrorPage";
import { PluginContext } from "context/PluginContext";
import TasksView from "view/TasksView";
import PageDataViewSettingTab from "SettingTab";

interface PageDataViewSettings {
	FolderToExclude: string;
}

const DEFAULT_SETTINGS: Partial<PageDataViewSettings> = {
	FolderToExclude: "",
};

export default class PageDataViewPlugin extends Plugin {
	root: Root | null = null;
	settings: PageDataViewSettings;

	async onload() {
		// Settings
		await this.loadSettings();

		// View
		const metadataChangeEvent = (handle: () => void) => {
			this.registerEvent(
				this.app.metadataCache.on("dataview:metadata-change", handle)
			);
		};
		const indexReadyEvent = (handle: () => void) => {
			this.registerEvent(
				this.app.metadataCache.on("dataview:index-ready", handle)
			);
		};
		this.registerMarkdownCodeBlockProcessor(
			"page-table",
			(source, el, ctx) => {
				this.root = createRoot(el);
				this.root.render(this.handleTableView(el, ctx, (
					<ReactView
					source={source}
					sourcePath={ctx.sourcePath}
					metadataChangeEvent={metadataChangeEvent}
					indexReadyEvent={indexReadyEvent}
				></ReactView>
				)));
			}
		);

		this.registerMarkdownCodeBlockProcessor(
			"page-tasks",
			(source, el, ctx) => {
				this.root = createRoot(el);
				this.root.render(this.handleTableView(el, ctx, (
					<TasksView
					source={source}
					sourcePath={ctx.sourcePath}
					metadataChangeEvent={metadataChangeEvent}
					indexReadyEvent={indexReadyEvent}
				></TasksView>
				)));

			}
		);

		this.registerMarkdownCodeBlockProcessor(
			"page-table-csv",
			(source, el, ctx) => {
				this.root = createRoot(el);
				this.root.render(this.handleTableView(el, ctx, (
					<CsvTableView
					source={source}
					sourcePath={ctx.sourcePath}
				></CsvTableView>
				)));
			}
		);

		// setting tab
		this.addSettingTab(new PageDataViewSettingTab(this.app, this));

	}

	handleTableView(
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext,
		Children: React.ReactNode
	) {
		if (!ctx.sourcePath) return;
		el.onClickEvent((event: MouseEvent) => {
			event.preventDefault();
		});

		return (
			<ErrorBoundary FallbackComponent={ErrorPage}>
				<PluginContext.Provider value={this}>
					{Children}
				</PluginContext.Provider>
			</ErrorBoundary>
		);
	}

	async onClose() {
		this.root?.unmount();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
