import { DataArray, DataObject, Literal } from "obsidian-dataview";
import React, { useState } from "react";
import { Platform } from "obsidian";
import MenuModal from "./MenuModal";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { filterList } from "interface/pageData";
import useFilterList from "hooks/useFilterList";
import { usePagesData } from "context/PagesDataContext";

export default function FilterList({
	property,
	pages,
}: {
	property: string;
	pages: DataArray<DataObject>;
}) {
	const { handleFilterList } = usePagesData();
	const [filterList] = useFilterList(pages, property);

	const [visible, setVisible] = useState(false);
	const [selectBtnValue, setSelectBtnValue] = useState(0);

	const handleClick = () => {
		const isMobile = Platform.isPhone;
		if (isMobile) {
			MenuModal(filterList).then((selected: filterList) => {
				if (handleFilterList) handleFilterList(property, selected);
			});
		} else {
			setVisible(!visible);
		}
	};

	return (
		<div
			className={
				selectBtnValue === 0
					? "box filter-list"
					: "box filter-list selected"
			}
			onClick={handleClick}
			onBlur={() => setVisible(false)}
			tabIndex={0}
		>
			<button className="filteringBtn clickable-icon nav-action-button collapse-icon">
				<div className="filter-list-title">{property}</div>
				<div className="filter-list-title-icon">
					{visible ? (
						<ChevronUp className="svg-icon" />
					) : (
						<ChevronDown className="svg-icon" />
					)}
				</div>
				{visible && (
					<div className="menu mod-no-icon">
						{filterList.map((item: Literal, index: number) => (
							<ListItem
								key={"ListItem" + index}
								item={item}
								index={index}
								property={property}
								selectBtnValue={selectBtnValue}
								setSelectBtnValue={setSelectBtnValue}
							/>
						))}
					</div>
				)}
			</button>
		</div>
	);
}

function ListItem({
	item,
	index,
	property,
	selectBtnValue,
	setSelectBtnValue,
}: {
	item: filterList;
	index: number;
	property: string;
	selectBtnValue: number;
	setSelectBtnValue: React.Dispatch<React.SetStateAction<number>>;
}) {
	const { handleFilterList, filterListItemLength } = usePagesData();

	let ListLength = 0;
	if (filterListItemLength) ListLength = filterListItemLength(property, item);
	if (ListLength === 0) return <></>;

	return (
		<div
			className={
				selectBtnValue === index
					? "menu-item mod-checked"
					: "menu-item tappable"
			}
			data-index={index}
			onMouseDown={(e) => e.preventDefault()}
			onClick={() => {
				setSelectBtnValue(index);
				if (handleFilterList) handleFilterList(property, item);
			}}
		>
			<div className="menu-item-icon"></div>
			<div className="menu-item-title">{item.label}</div>
			<span>({ListLength})</span>
			{selectBtnValue === index && (
				<div className="menu-item-icon mod-checked">
					<Check className="svg-icon" />
				</div>
			)}
		</div>
	);
}