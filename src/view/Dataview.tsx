import inputValidation from "validation/inputValidation";
import { useEffect, useState } from "react";
import getDataviewAPI from "API/Dataview";
import Lading from "components/Lading";
import PageDataContainer from "components/PageDataContainer";

export default function Dataview({
	source,
	sourcePath,
	metadataChangeEvent,
	indexReadyEvent,
}: {
	source: string;
	sourcePath: string;
	metadataChangeEvent: (handle: () => void) => void;
	indexReadyEvent: (handle: () => void) => void;
}) {
	// Get Dataview API
    const dv = getDataviewAPI();
    // paser source
	const input = inputValidation(source);
    
	const [isLoading, setIsLoading] = useState(!dv.index.initialized);
	const [pages, setPages] = useState(!isLoading ? dv.pages(input.pages) : []);
    
    // 랜더링 전에 source 파싱 -> view 속성 값에 따라 표시
    // csv는 어떤 방식으로 하면 좋을까

	useEffect(() => {
		if (!isLoading) {
			metadataChangeEvent(() => {
				setPages(dv.pages(input.pages));
			});
		} else {
			indexReadyEvent(() => {
				setPages(dv.pages(input.pages));
				setIsLoading(false);
			});
		}
	}, []);

	return (
		<>
			{isLoading ? (
				<Lading />
			) : (
				<PageDataContainer
					input={input}
					pages={(input.where) ? pages.filter(new Function("return " + input.where)()) : pages}
					sourcePath={sourcePath}
				/>
			)}
		</>
	);
}
