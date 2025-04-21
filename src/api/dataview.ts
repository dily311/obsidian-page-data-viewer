import { App } from 'obsidian';
import { getAPI, isPluginEnabled, DataviewApi } from 'obsidian-dataview'

export default function getDataviewAPI(): DataviewApi {
    if (!isPluginEnabled(this.app as App)) {
        throw new Error("Could not access Dataview API")        
    }

    const api = getAPI(this.app);
    if (api) return api;
}

export const dvSettings = getDataviewAPI().settings;

declare module "obsidian" {	
	interface MetadataCache {
		on(name: "dataview:index-ready", callback: () => unknown, ctx?: unknown): EventRef;
		on(
			name: "dataview:metadata-change",
			callback: (
				...args:
					| [op: "rename", file: TAbstractFile, oldPath: string]
					| [op: "delete", file: TFile]
					| [op: "update", file: TFile]
			) => unknown,
			ctx?: unknown
		): EventRef;
	}
  }