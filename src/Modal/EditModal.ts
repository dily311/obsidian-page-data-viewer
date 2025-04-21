import PageDataViewPlugin from "main";
import { App, Modal } from "obsidian";

export default class EditModal extends Modal {
    plugin: PageDataViewPlugin;

    constructor(app: App) {
        super(app);
    }

    open(): void {
        this.setContent("I'm Modal ");

    }
}