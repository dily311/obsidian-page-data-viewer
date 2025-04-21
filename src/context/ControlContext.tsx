import QueryType from "interface/QueryData";
import { createContext, Dispatch, useContext } from "react";
import { DataArray, DataObject } from "obsidian-dataview";

interface Action {
	type: string;
	payload: number;
	keyword: string;
}

interface ControlReducerContextType {
	state: ControlContextType;
	dispatch: Dispatch<any>;
}

interface ControlContextType {
    query: QueryType;
	pages: DataArray<DataObject>;

    // PaginationType
    currentPageNum: number;
    totalPages: number;
    startBtn: number;

    // search
    searchKeyword: string;
    
}

export function createInitialState({
	query,
	pages
}: {
	query: QueryType;
	pages: DataArray<DataObject>;
}): ControlContextType {
	return {
		query: query,
		pages: pages,

		// PaginationType
		currentPageNum: 1,
		totalPages: Math.ceil(pages.length / query.viewListCount),
		startBtn: 1,

		// search
		searchKeyword: "",	
	}
}

export function controlReducer(
	state: ControlContextType,
	action: Action
): ControlContextType {
	switch (action.type) {
		// pagination
		case "NEXT_PAGE":
			return {
				...state,
				currentPageNum: Math.min(
					state.totalPages,
					state.currentPageNum + 1
				),
			};
		case "PREV_PAGE":
			return {
				...state,
				currentPageNum: Math.max(1, state.currentPageNum - 1),
			};
		case "SET_PAGE":
			return { ...state, currentPageNum: action.payload };
		case "NEXT_PAGINATION":
			return {
				...state,
				startBtn: state.startBtn + state.query.viewBtnCount,
				currentPageNum: state.startBtn + state.query.viewBtnCount,
			};
		case "PREV_PAGINATION":
			return {
				...state,
				startBtn: state.startBtn - state.query.viewBtnCount,
				currentPageNum: state.startBtn - state.query.viewBtnCount,
			};

		//  한번에 표시되는 페이지 리스트 컨트롤
		case "SELECT_VIEWLISTCOUNT":
			return {
				...state,
				startBtn: 1,
				currentPageNum: 1,
				totalPages: Math.ceil(state.pages.length / action.payload),
				query: {
					...state.query,
					viewListCount: action.payload,
				},
			};
		
		// 검색
		case "WRITE_SEARCH":
			return {...state, searchKeyword: action.keyword}
		case "INIT_SEARCH":
			return {...state, searchKeyword: ""}
		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
}

//  Context 생성
export const ControlContext = createContext<ControlReducerContextType | null>(null);
// Custom Hook
export const useControl = (): ControlReducerContextType => {
	const controlContext = useContext(ControlContext);
	if (!controlContext) {
		throw new Error("ControlContext has to be used within <ControlContext.Provider>");
	}
	return controlContext;
};
