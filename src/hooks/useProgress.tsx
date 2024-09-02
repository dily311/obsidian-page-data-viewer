export default function useProgress(
	progressWidth: number,
	strokeWidth: number,
	progress: number
) {
	const PER = progressWidth / 2;
	const RADIUS = PER - strokeWidth;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
	const dashoffset = CIRCUMFERENCE * (1 - progress / 100);
    
    let colorType = "var(--interactive-accent)";
    if (80 < progress) {
        colorType = "var(--color-green)";
    } else if (60 < progress) {
        colorType = "var(--color-yellow)";
    } else if (40 < progress) {
        colorType = "var(--color-orange)";
    } else {
        colorType = "var(--color-red)";
    }

    return {PER, RADIUS, CIRCUMFERENCE, dashoffset, colorType}
}
