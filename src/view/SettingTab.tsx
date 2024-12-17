import PageDataViewPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export default class PageDataViewSettingTab extends PluginSettingTab {
  plugin: PageDataViewPlugin;

  constructor(app: App, plugin: PageDataViewPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Folder to Exclude")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.FolderToExclude)
          .onChange(async (value) => {
            this.plugin.settings.FolderToExclude = value;
            await this.plugin.saveSettings();
          })
      );
  }
}