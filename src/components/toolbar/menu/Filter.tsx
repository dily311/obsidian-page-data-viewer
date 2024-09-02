import { useState } from "react";
import { MenuContainer } from "./MenuContainer";
import { filter } from "interface/pageData";
import { FilterIcon } from "lucide-react";
import { Platform } from "obsidian";
import MenuModal from "./MenuModal";
import { usePagesData } from "context/PagesDataContext";


export default function Filter({filter}: {filter: filter[]}) {
	const { selectFilterValue, handleFilter } = usePagesData();
	const [visible, setVisible] = useState(false);
	const isMobile = Platform.isPhone;

	const handleClick = () => {
		if (isMobile) {
			MenuModal(filter).then((selected) => {
				const index = filter.findIndex((item) => item === selected);
				if (handleFilter) handleFilter(index);
			});
		} else {
			setVisible(!visible);
		}
	};

	return (
		<div
			className="box"
			onClick={handleClick}
			onBlur={() => setVisible(false)}
			tabIndex={0}
		>
			<button
				className="filteringBtn clickable-icon nav-action-button"
				aria-label="필터 보기"
			>
				<FilterIcon className="svg-icon" />
				{visible && selectFilterValue && handleFilter && (
					<MenuContainer
						list={filter}
						selectBtnValue={selectFilterValue}
						clickHandle={handleFilter}
						useSeparator={false}
					></MenuContainer>
				)}
			</button>
		</div>
	);
}

