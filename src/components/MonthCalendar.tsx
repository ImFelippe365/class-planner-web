import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useRef, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
	CalendarOptions,
	DayCellContentArg,
	EventContentArg,
} from "@fullcalendar/core";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthCalendarProps extends CalendarOptions {
	getCalendarRef?: (ref: any) => void;
	defaultSelectedDate?: Date;
	onDatePress?: (date: Date) => void;
	onMonthViewChange?: (date: Date) => void;
	singleActiveDay?: number;
}

export default function MonthCalendar({
	getCalendarRef = () => {},
	defaultSelectedDate = new Date(),
	onDatePress = () => {},
	onMonthViewChange = () => {},
	singleActiveDay,
	...props
}: MonthCalendarProps) {
	const calendarRef = useRef<any>(null);
	const [selectedDate, setSelectedDate] = useState<Date>(defaultSelectedDate);
	const [calendarCurrentDate, setCalendarCurrentDate] = useState(selectedDate);

	const onSelectDate = (date: Date) => {
		onDatePress(date);
		setSelectedDate(date);
	};

	const DayCell = (event: DayCellContentArg) => {
		const selectCondition =
			event.date.toLocaleDateString("pt-BR") ===
			selectedDate.toLocaleDateString("pt-BR");

		const selectedDayColor = selectCondition
			? "bg-primary text-white"
			: "hover:bg-primary-dark-transparent";
		return (
			<div
				className={`w-full flex items-center justify-center ${
					singleActiveDay
						? event.date.getDay() !== singleActiveDay && "opacity-40"
						: ""
				}`}
			>
				<button
					type="button"
					onClick={() =>
						singleActiveDay
							? event.date.getDay() === singleActiveDay &&
							  onSelectDate(event.date)
							: onSelectDate(event.date)
					}
					className={`cursor-pointer  rounded-full w-8 h-8 text-center ${selectedDayColor}`}
				>
					{event.dayNumberText}
				</button>
			</div>
		);
	};

	const DaySchedule = (event: EventContentArg) => {
		return (
			<div
				style={{
					backgroundColor: event.backgroundColor,
				}}
				className={`w-2 h-2 items-center justify-center rounded-full`}
			/>
		);
	};

	const onMonthChange = (direction: "prev" | "next") => {
		if (direction === "next") {
			calendarRef?.current?.getApi().next();
		} else if (direction === "prev") {
			calendarRef?.current?.getApi().prev();
		}
		const newDate = calendarRef.current.getApi().getDate();

		setCalendarCurrentDate(newDate);
		onMonthViewChange(newDate);
	};

	const currentMonth =
		calendarCurrentDate
			.toLocaleDateString("pt-BR", {
				month: "long",
				year: "numeric",
			})[0]
			.toUpperCase() +
		calendarCurrentDate
			.toLocaleDateString("pt-BR", {
				month: "long",
				year: "numeric",
			})
			.slice(1);

	return (
		<section className="monthCalendarContainer">
			<header className="flex items-center justify-between px-4 mb-3">
				<button
					type="button"
					className="hover:bg-primary-background p-1 rounded-full transition-all"
					onClick={() => onMonthChange("prev")}
				>
					<ChevronLeft size={18} className="text-gray" />
				</button>
				<span className="text-black text-lg font-bold">{currentMonth}</span>
				<button
					type="button"
					className="hover:bg-primary-background p-1 rounded-full transition-all"
					onClick={() => onMonthChange("next")}
				>
					<ChevronRight size={18} className="text-gray" />
				</button>
			</header>
			<FullCalendar
				ref={(r) => {
					calendarRef.current = r;
					getCalendarRef(r);
				}}
				initialDate={selectedDate}
				initialView="dayGridMonth"
				plugins={[dayGridPlugin]}
				dayHeaderFormat={{
					weekday: "narrow",
				}}
				locale={"pt-BR"}
				height={"auto"}
				weekends={false}
				dayCellContent={DayCell}
				dayCellClassNames={(event) =>
					event.isToday ? "text-primary" : "text-black text-center"
				}
				dayMaxEvents={false}
				dayMaxEventRows={4}
				eventMaxStack={3}
				// dayMinWidth={10}
				headerToolbar={false}
				eventContent={DaySchedule}
				eventClassNames={"flex items-center"}
				{...props}
			/>
		</section>
	);
}
