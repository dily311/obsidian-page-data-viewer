import { Literal } from "obsidian-dataview";
import { DateTime, Duration } from "luxon";

/** Normalize a duration to all of the proper units. */

export function normalizeDuration(dur: Duration) {
	if (dur === undefined || dur === null) return dur;

	return dur.shiftToAll().normalize();
}
/** Render a DateTime in a minimal format to save space. */

export function renderMinimalDate(time: DateTime, setting: Literal, locale: string): string {
	// If there is no relevant time specified, fall back to just rendering the date.
	if (time.second == 0 && time.minute == 0 && time.hour == 0) {
		return time.toLocal().toFormat(setting?.defaultDateFormat, { locale });
	}

	return time.toLocal().toFormat(setting?.defaultDateTimeFormat, { locale });
}
/** Render a duration in a minimal format to save space. */

export function renderMinimalDuration(dur: Duration): string {
	dur = normalizeDuration(dur);

	// toHuman outputs zero quantities e.g. "0 seconds"
	dur = Duration.fromObject(
		Object.fromEntries(Object.entries(dur.toObject()).filter(([, quantity]) => quantity != 0))
	);

	return dur.toHuman();
}
/** Test-environment-friendly function which fetches the current system locale. */

export function currentLocale(): string {
	if (typeof window === "undefined") return "en-US";
	return window.navigator.language;
}

export function getRelativeTime(dateTime: DateTime, setting: Literal, locale: string): string {
	const now = DateTime.now();
	if (now.year !== dateTime.year) {
		return  dateTime.toLocal().toFormat(setting?.defaultDateFormat, { locale });
	}
	const relative = dateTime.toRelativeCalendar({ base: now, locale: locale });
	return (relative)? relative: "";
}
