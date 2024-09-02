import { filter, sort } from "interface/pageData";
import { Check } from "lucide-react";
import React from "react";

export function MenuContainer({ list, selectBtnValue, clickHandle, useSeparator }: {
	list: filter[] | sort[] | string[]
	selectBtnValue : number[]
	clickHandle: (arg: number) => void
	useSeparator: boolean
}) {
	return (
		<div className="menu mod-no-icon">
			{list.map((item, index: number) => (
				<React.Fragment key={"ListItem" + index}>
					<div
						className={
							selectBtnValue.includes(index)
								? "menu-item mod-checked"
								: "menu-item tappable"
						}
						data-index={index}
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => clickHandle(index)}
					>
						<div className="menu-item-icon"></div>
						<div className="menu-item-title">
							{typeof item === "string" ? item : item.label}
						</div>
						{selectBtnValue.includes(index) && (
							<div className="menu-item-icon mod-checked">
								<Check className="svg-icon" />
							</div>
						)}
					</div>
					{useSeparator && index % 2 !== 0 && (
						<div className="menu-separator"></div>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
