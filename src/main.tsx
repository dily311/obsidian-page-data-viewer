import getDataviewAPI from "api/dataview";
import ErrorPage from "components/ErrorPage";
import { PluginContext } from "context/PluginContext";
import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import ParseQuery from "query/ParseQuery";
import { createRoot, Root } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import PageDataViewSettingTab from "setting";
import { DataArray, DataObject } from "obsidian-dataview";
import PageTableBlockProcessor from "PageTableBlockProcessor";
interface PageDataViewSettings {
	FolderToExclude: string;
}

const DEFAULT_SETTINGS: Partial<PageDataViewSettings> = {
	FolderToExclude: "",
};

export default class PageDataViewPlugin extends Plugin {
	settings: PageDataViewSettings;
	root: Root | null = null;

	async onload() {
		// 세팅 불러오기
		await this.loadSettings();
		// 세팅 탭 추가
		this.addSettingTab(new PageDataViewSettingTab(this.app, this));

		// 페이지 뷰
		this.registerMarkdownCodeBlockProcessor("page-table", (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			if (!ctx.sourcePath) return;
			const dv = getDataviewAPI();
			if (!dv) return;
			
			const parser = new ParseQuery(source, ctx.sourcePath, "pages");
			const query = parser.parse();
			if (!query) return;
			
			const getDataviewPages:() => DataArray<DataObject> = () => dv.pages(query.query);

			this.root = createRoot(el);
			this.root.render(
				<ErrorBoundary FallbackComponent={ErrorPage}>
					<PluginContext.Provider value={this}>
						<PageTableBlockProcessor
							query={query}
							sourcePath={ctx.sourcePath}
							isDataviewLoading={dv.index.initialized}
							getDataviewPages={getDataviewPages}
						></PageTableBlockProcessor>
					</PluginContext.Provider>
				</ErrorBoundary>
			);
		})
	}

	async onClose() {
		this.root?.unmount();
		console.log("Disable pages data plugin");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
