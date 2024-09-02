import { Search } from "lucide-react";

export default function SearchBtn() {
	return (
		<div>
			<button
				className="searchBtn clickable-icon"
				aria-label="검색 필터 보기"
			>
				<Search className="svg-icon" />
			</button>
		</div>
	);
}
