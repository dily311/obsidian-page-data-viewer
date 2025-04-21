import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useState } from "react";

export default function Calendar({
    selectedDate,
    setSelectedDate
} : {
    selectedDate: DateTime<true> | DateTime<false>;
    setSelectedDate:  React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false>>>;
}) {
	const weekTextArr = ["일", "월", "화", "수", "목", "금", "토"];

	const now = DateTime.now();
	const [date, setDate] = useState(DateTime.local(now.year, now.month));
	const months = calendar_months(date, selectedDate);

	const handleDateSetPrevMonth = () => {
		setDate(date.plus({ month: -1 }));
	};
	const handleDateSetNextMonth = () => {
		setDate(date.plus({ month: 1 }));
	};
	const handleDateSetToday = () => {
		setDate(now);
		setSelectedDate(now);
	};
	const handleSelectedDate = (year: number, month: number, day: number) => {
		setSelectedDate(DateTime.local(year, month, day));
	};
	return (
		<div className="calendar_wrap">
			<div className="calendar_title_container">
				<div className="calendar_title">
					{date.year}년 {date.month}월
				</div>
				<div className="calendar_chose">
					<button className="clickable-icon" onClick={handleDateSetPrevMonth}>
						<ChevronLeft className="svg-icon" />
					</button>
					<button className="clickable-icon" onClick={handleDateSetToday}>
						오늘
					</button>
					<button className="clickable-icon" onClick={handleDateSetNextMonth}>
						<ChevronRight className="svg-icon" />
					</button>
				</div>
			</div>
			<table className="calendar">
				<thead>
					<tr>
						{weekTextArr.map((value, index) => (
							<th key={index}>{value}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{months.map((week, index) => (
						<tr key={index}>
							{week.map((day, i) => (
								<td key={index + i} className={day.cls}>
									{day && (
										<button
											className=" clickable-icon"
											onClick={() =>
												handleSelectedDate(
													day.year,
													day.month,
													day.day
												)
											}
										>
											{day.day}
										</button>
									)}
                                    
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function calendar_months(date: DateTime, datePick:DateTime) {
	const now = DateTime.now();
	const firstDayOfThisMonth = date.startOf("month");
	const startOfWeek = firstDayOfThisMonth.weekday ;
	const endDayOfThisMonth = date.endOf("month");

	const prevMonth = date.plus({month: -1});
	const endDayOfPrevMonth = prevMonth.endOf("month");
	const nextMonth = date.plus({month: 1});

	const selectedDateCalc = ((date.year - datePick.year) * 12) + (date.month - datePick.month);
	const nowDateCalc = ((date.year - now.year) * 12) + (date.month - now.month);
	
	let setDay = 1;
	let setPrevMonthDay = (endDayOfPrevMonth.day + 1) - startOfWeek;
	let setNextMonthDay = 1;
	const result = new Array(6).fill(null).map(() =>
		new Array(7).fill(null).map((_, index) => {
			let cls = "";

			if ((setDay === 1) && (index < startOfWeek) && (startOfWeek !== 7 && index !== 7)) {
				cls += "prev";
				cls += (selectedDateCalc === 1 && setPrevMonthDay === datePick.day) ? " selected": "";
				cls += (nowDateCalc === 1 && setPrevMonthDay === now.day) ? " today": "";
				
				return {
					year: prevMonth.year,
					month: prevMonth.month,
					day: setPrevMonthDay++,
					cls : cls
				};
			}
			if (endDayOfThisMonth.day < setDay) {
				cls += "next";
				cls += (selectedDateCalc === -1 && setNextMonthDay === datePick.day) ? " selected": "";
				cls += (nowDateCalc === -1 && setNextMonthDay === now.day) ? " today": "";

				return {
					year: nextMonth.year,
					month: nextMonth.month,
					day: setNextMonthDay ++,
					cls:  cls
				};
			}

			cls += (selectedDateCalc === 0 && setDay === datePick.day) ? " selected": "";
			cls += (nowDateCalc === 0 && setDay === now.day) ? " today": "";
			return {
				year: date.year,
				month: date.month,
				day: setDay++,
				cls: cls
			};
		})
	);
	return result
}