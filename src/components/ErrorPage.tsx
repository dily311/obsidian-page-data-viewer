import { FallbackProps } from "react-error-boundary";

export function ErrorPage({ error }: FallbackProps) {
	return (
		<section>
			<div>
				<h1>ErrorPage</h1>
				<pre>{error.message}</pre>
			</div>
		</section>
	);
}
