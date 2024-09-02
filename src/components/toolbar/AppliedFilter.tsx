import { usePagesData } from "context/PagesDataContext";
import { filter } from "interface/pageData";

export default function AppliedFilter({ filter }: { filter: filter[] }) {
	const { selectFilterValue, deleteFilter } = usePagesData();
	return (
		<div className="appliedFilter">
			{selectFilterValue && selectFilterValue.length !== 0 && (
				<>
					<span className="filter-tip">Filter :</span>
					{selectFilterValue.map(
						(select) =>
							deleteFilter && (
								<button
									key={"selectFilterItem" + select}
									className="clickable-icon filter-item"
									data-index={select}
									onClick={(e) =>
										deleteFilter(
											Number(
												e.currentTarget.dataset.index
											)
										)
									}
								>
									{filter[select].label}
								</button>
							)
					)}
				</>
			)}
		</div>
	);
}

