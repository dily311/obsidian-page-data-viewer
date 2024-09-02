import { filter, filterList, sort } from "interface/pageData";
import { FuzzySuggestModal } from "obsidian";

export default function MenuModal(values: filter[] | sort[] | string[] | filterList[]) {
    const data = new Promise((resolve, reject) => {
        this.MySuggestModal = class extends FuzzySuggestModal<filter | sort | string | filterList>{
            getItems() {
                return values
            }
            getItemText(val: filter | sort | string | filterList) {
                return (typeof val === "string")? val :val.label;
            }
            onChooseItem(val: filter | sort | filterList, event: MouseEvent | KeyboardEvent) {
                resolve(val)
            }
        }
        new this.MySuggestModal(this.app).open();
    });
    return data;
}
