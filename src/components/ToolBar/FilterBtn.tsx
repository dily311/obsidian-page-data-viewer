import { FilterIcon } from "lucide-react";

export default function FilterBtn() {
	return (
        <div className="toolBar-action-button">
            <button
                className="clickable-icon nav-action-button"
                aria-label="필터 보기"
            >
                <FilterIcon className="svg-icon" />
            </button>
        </div>
	);
}
