import { usePagesData } from "context/PagesDataContext";

export default function Select() {
	const { viewListNum, setViewListNum, selectedArr } = usePagesData();
	return (
		<select
			className="selectPageNum dropdown"
			aria-label="현재 표시되는 페이지 수 조절"
			value={viewListNum}
			onChange={(e) => setViewListNum(Number(e.target.value))}
		>
			{selectedArr.map((num: number) => (
				<option key={"selected" + num} value={num}>
					{num}
				</option>
			))}
		</select>
	);
}
