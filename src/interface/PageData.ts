import Filter from "./Filter";
import Sort from "./Sort";


export interface PageData {
	readonly layout: string;
	readonly pages: string;
	readonly where?: string;

	readonly rows: Array<string>;
	readonly showRows: Array<string>;

	readonly selectedValue: number;
	readonly selectedArr: number[];

	readonly filter: Filter[];
	readonly filterDefault: number[];
	readonly filterList?: string[];

	readonly sort: Sort[];
	readonly selectedSortValue: number;

	readonly cls: string;
	readonly header?: string;
	readonly options: Array<string>;
}
