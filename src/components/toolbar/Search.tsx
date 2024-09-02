import { usePagesData } from "context/PagesDataContext";

export default function Search() {
	const { searchValue, handleSearch, handleSearchInit } = usePagesData();
	return (
		<div className="search-input-container">
			<input
				className="textSearch"
				type="search"
				enterKeyHint="search"
				spellCheck={false}
				placeholder="입력하여 검색 시작..."
				value={searchValue}
				onChange={(e) => handleSearch(e.target.value)}
			/>
			<div
				className="search-input-clear-button"
				onClick={handleSearchInit}
			></div>
		</div>
	);
}
