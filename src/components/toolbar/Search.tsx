import { useControl } from "context/ControlContext";

export default function Search() {
	const { state, dispatch } = useControl();
    
	return (
		<div className="search-input-container">
			<input
				className="textSearch"
				type="search"
				enterKeyHint="search"
				spellCheck={false}
				placeholder="입력하여 검색 시작..."
				value={state.searchKeyword}
				onChange={(e) => dispatch({type: "WRITE_SEARCH", keyword: e.target.value})}
			/>
			<div
				className="search-input-clear-button"
				onClick={() => dispatch({type: "INIT_SEARCH"})}
			></div>
		</div>
	);
}
