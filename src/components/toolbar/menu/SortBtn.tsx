import { useState } from "react";
import { sort } from "interface/pageData";
import { ArrowUpDown } from "lucide-react";
import { Platform } from "obsidian";
import MenuModal from "./MenuModal";
import { MenuContainer } from "./MenuContainer";
import { usePagesData } from "context/PagesDataContext";

export default function SortBtn({sort}: {sort: sort[]}) {
	const { selectSortNum, handleSort } = usePagesData();
	const [visible, setVisible] = useState(false);
	const isMobile = Platform.isPhone;

	const handleClick = () => {
		if (isMobile) {
			MenuModal(sort).then((selected) => {
				const index = sort.findIndex((item) => item === selected);
				handleSort(index);
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
				className="clickable-icon nav-action-button"
				aria-label="정렬 순서 변경"
			>
				<ArrowUpDown className="svg-icon" />
			</button>
			{visible && (
				<MenuContainer
					list={sort}
					selectBtnValue={[selectSortNum]}
					clickHandle={handleSort}
					useSeparator={true}
				></MenuContainer>
			)}
		</div>
	);
}
