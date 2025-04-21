import { useControl } from "context/ControlContext";
import { ArrowUpDown } from "lucide-react";

export default function SortBtn() {
	const { state, dispatch } = useControl();

	const sortItem = state.query.sort;

	return (
		<div className="toolBar-action-button">
			<button
				className="clickable-icon nav-action-button"
				aria-label="정렬 순서 변경"
			>
				<ArrowUpDown className="svg-icon" />
			</button>
		</div>
	);
}
