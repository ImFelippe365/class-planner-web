import FullCalendar from "@fullcalendar/react";
import React from "react";

import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
	CalendarOptions,
	DayHeaderContentArg,
	EventContentArg,
	SlotLabelContentArg,
	SlotLaneContentArg,
} from "@fullcalendar/core";
import { shortWeekdays } from "@/utils/dates";

interface WeekCalendarProps extends CalendarOptions {}

export default function WeekCalendar({ ...props }: WeekCalendarProps) {
	const DayHeader = (props: DayHeaderContentArg) => {
		const date = new Date(props.date);
		const weekdayName = date.getDate();

		return (
			<div className={`flex flex-col justify-center items-center p-4 `}>
				<span
					className={`font-bold text-black text-3xl ${
						props.isToday && "text-primary"
					}`}
				>
					{weekdayName}
				</span>
				<span className="text-gray font-normal text-lg">
					{shortWeekdays[date.getDay()]}
				</span>
			</div>
		);
	};

	const SlotLabel = (props: SlotLabelContentArg) => {
		const date = new Date(props.date);
		const hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, "0");

		return (
			<div className="font-semibold text-gray">
				{hours}:{minutes}
			</div>
		);
	};

	const ScheduleEvent = (props: EventContentArg) => {
		const {
			isSelected,
			timeText,
			isDragging,
			event: { startStr, endStr, title, display },
		} = props;

		if (display === "background") return null;

		const start = new Date(startStr);
		const end = new Date(endStr);

		const scheduleStartHours = start?.getHours();
		const scheduleStartMinutes = start
			?.getMinutes()
			.toString()
			.padStart(2, "0");

		const scheduleEndHours = end?.getHours();
		const scheduleEndMinutes = end?.getMinutes().toString().padStart(2, "0");

		const scheduleTime = `${scheduleStartHours}:${scheduleStartMinutes} -
		${scheduleEndHours}:${scheduleEndMinutes}`;

		return (
			<div {...props} className="flex flex-col p-3">
				<span className="font-semibold">{title}</span>
				<span className="font-normal">
					{isDragging ? timeText : scheduleTime}
				</span>
			</div>
		);
	};

	return (
		<FullCalendar
			allDaySlot={false}
			initialView="timeGridWeek"
			plugins={[timeGridPlugin, interactionPlugin]}
			droppable
			headerToolbar={false}
			nowIndicator={false}
			eventOverlap={false}
			weekends={false}
			slotMinTime={{
				hours: 13,
			}}
			slotMaxTime={{
				hours: 18,
			}}
			slotDuration={{
				minute: 5,
			}}
			dayHeaderContent={DayHeader}
			slotLabelContent={SlotLabel}
			nowIndicatorContent={<div>teste</div>}
			slotLaneContent={(props: SlotLaneContentArg) => (
				<td className="bg-background-color h-8 border-collapse" {...props}></td>
			)}
			eventClassNames={(props) =>
				props.event.display !== "background"
					? "border-l-4 border-l-red-500 border-solid rounded-l-none rounded-r-8 border-y-0 border-r-0 rounded-tr-2xl rounded-br-2xl"
					: "bg-yellow-500"
			}
			eventContent={ScheduleEvent}
			locale={"pt-BR"}
			editable
			{...props}
		/>
	);
}
