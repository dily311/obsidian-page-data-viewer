import Filter from "./Filter";
import Sort from "./Sort";

export type LayoutType =  "table" | "cards" | "list" | "calendar" | "tasks";

export default interface QueryType {
	// 레이아웃
	type: "pages" | "csv";
	layout: LayoutType;

	// 검색 쿼리
	query: string;
	where?: string;

	// 행
	rows: string[];
	displayRows: string[];

	// 표시되는 페이지네이션 버튼 수
	viewBtnCount: number;
	// 표시되는 페이지 수
	viewListCount: number;
	viewSelectListCountArr: number[]; // viewListCount 선택할 수 있는 배열

	// 필터
	filter: Filter[];
	filterDefault: number[];
	filterList?: string[];

	// 정렬
	sort: Sort[];
	sortSelectedValue: number;

	// 옵션
	options?: Array<string>;
}
