import { useEffect } from "react";
import { useRef } from "react";

export default function Observer({
	selectedValue,
	setViewListNum,
}: {
	selectedValue: number;
	setViewListNum: React.Dispatch<React.SetStateAction<number>>;
}) {
	const ref = useRef(null);

	// 화면에 표시할 데이터 리스트 갯수
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setViewListNum((current) => current + selectedValue);
					}
					if (!entry.target.hasChildNodes()) {
						observer.unobserve(entry.target);
					}
				});
			}, {
				threshold: 0.001
			});

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer && observer.disconnect();
	}, []);

	return (
		<div ref={ref}>
			<button
				className="moreBtn"
				onClick={() =>
					setViewListNum((current) => current + selectedValue)
				}
			>
				More
			</button>
		</div>
	);
}
