import { usePagesData } from "context/PagesDataContext";
import { usePagination } from "../../hooks/usePagination";

export default function Pagination() {
	const { currentPageNum, fullPaginationNum, setCurrentPageNum, viewBtnNum } = usePagesData();
	const { pageNumbers, prev, next, paginate, startBtn, endBtn } = usePagination(
		setCurrentPageNum,
		fullPaginationNum,
        viewBtnNum
	);

	return (
		<div className="pagination-box">
			{startBtn === 1 ? null : (
				<button
					className="clickable-icon is-disabled pagination-prevBtn"
					aria-label="이전"
					onClick={prev}
				>
					&lt;
				</button>
			)}

			{pageNumbers.map((num) => (
				<button
					key={"paginationBtn" + num}
					className={`${currentPageNum === num ? "is-active" : ""}`}
					onClick={() => paginate(num)}
				>
					{num}
				</button>
			))}

			{endBtn === fullPaginationNum ? null : (
				<button
					className="clickable-icon is-disabled pagination-prevBtn"
					aria-label="다음"
					onClick={next}
				>
					&gt;
				</button>
			)}
		</div>
	);
}
