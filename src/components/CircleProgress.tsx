import useProgress from "hooks/useProgress";

export default function CircleProgress({
	progressWidth,
	strokeWidth,
	progress,
}: {
	progressWidth: number;
	strokeWidth: number;
	progress: number;
}) {
	const {PER, RADIUS, CIRCUMFERENCE, dashoffset, colorType} = useProgress(progressWidth, strokeWidth, progress);

	return (
		<div
			role="progressbar"
			aria-valuenow={progress}
			className="circle_progress_wrap"
		>
			<svg
				className="circle_progress"
				viewBox={`0 0 ${progressWidth} ${progressWidth}`}
				color="transparent"
				style={{
					width: progressWidth,
					height: progressWidth,
					transform: "rotate(-90deg)",
					transformOrigin: "50% 50%",
				}}
			>
				<circle
					r={RADIUS}
					cx={PER}
					cy={PER}
					strokeWidth={strokeWidth}
					stroke="var(--background-secondary)"
					strokeLinecap="round"
					fill="transparent"
				></circle>
				<circle
					r={RADIUS}
					cx={PER}
					cy={PER}
					strokeWidth={strokeWidth}
					stroke={colorType}
					strokeLinecap="round"
					strokeDasharray={CIRCUMFERENCE}
					strokeDashoffset={dashoffset}
					fill="transparent"
				>
				</circle>
				<text
					x={PER}
					y={PER}
					textAnchor="middle"
					dominantBaseline="middle"
					fill="rgba(120, 119, 116, 1)"
					fontSize="0.75em"
					style={{
						transformOrigin: "50% 50%",
						transform: "rotate(90deg)",
					}}
				>
					{progress}%
				</text>
			</svg>
		</div>
	);
}
