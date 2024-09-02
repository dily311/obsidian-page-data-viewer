import { useEffect, useState } from "react";
import getDataviewAPI from "API/Dataview";
import { DataArray, DataObject } from "obsidian-dataview";
import inputValidation from "validation/inputValidation";
import PageDataContainer from "components/PageDataContainer";
import Lading from "components/Lading";

export default function CsvTableView({
	source,
	sourcePath,
}: {
	source: string;
	sourcePath: string;
}) {
	const dv = getDataviewAPI();
	const input = inputValidation(source, "csv");
	const [pages, setPages] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		dv.io.csv(input.pages).then((data: DataArray<DataObject>) => {
			// 정렬
			if (input.selectedSortValue !== 0) {
				data.values = data.values.reverse();
			}
			setPages(data);
		});
		
		if (isLoading) {
			setIsLoading(false);
		}
	}, []);

	return (
		<>
			{isLoading ? (
				<Lading />
			) : (
				<PageDataContainer
					input={input}
					pages={pages}
					sourcePath={sourcePath}
				/>
			)}
		</>
	);
}
