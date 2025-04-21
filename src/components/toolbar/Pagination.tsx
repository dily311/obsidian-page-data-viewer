import { useControl } from "context/ControlContext";

export default function Pagination() {
	console.log("Pagination component");
	const { state, dispatch } = useControl();

	const endBtn = Math.min(state.totalPages, state.startBtn + state.query.viewBtnCount - 1)
	const pagination = [...Array((endBtn+1) - state.startBtn)].map((v, i) => state.startBtn + i)

	return (
		<div className="pagination_container">
			{state.startBtn === 1 ? null : (
				<button
					className="clickable-icon is-disabled pagination-prevBtn"
					aria-label="이전"
					onClick={() => dispatch({type: "PREV_PAGINATION"})}
				>
					&lt;
				</button>
			)}

			{pagination.map((num) => (
				<button
					key={num}
					className={"clickable-icon " + `${state.currentPageNum === num ? "is-active" : ""}`}
					onClick={() => dispatch({ type: "SET_PAGE", payload: num })}
				>
					{num}
				</button>
			))}

			{ state.totalPages === endBtn ? null : (
				<button
					className="clickable-icon is-disabled pagination-prevBtn"
					aria-label="다음"
					onClick={() => dispatch({ type: "NEXT_PAGINATION" })}
				>
					&gt;
				</button>
			)}
		</div>
	);
}
