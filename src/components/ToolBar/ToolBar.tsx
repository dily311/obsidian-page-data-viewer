import Pagination from "./Pagination";
import Select from "./Select";
import Search from "./Search";
import SettingsBtn from "./SettingsBtn";
import { useControl } from "context/ControlContext";
import FilterBtn from "./FilterBtn";

export default function ToolBar() {
	const { state } = useControl();
	console.log("toolbar component");

	return (
		<>
			<div className="toolBar_container">
				<div className="toolBar">
					{state.query.layout !== "calendar" && (
						<div className="toolBar_left">
							<Select />
							<Pagination />
						</div>
					)}
					<div className="toolBar_right">
						<Search />
						{state.query.filter.length !== 0 && <FilterBtn />}
						
						<SettingsBtn />
					</div>
				</div>
				<div className="toolBar_filterList">

				</div>
			</div>
		</>
	);
}
