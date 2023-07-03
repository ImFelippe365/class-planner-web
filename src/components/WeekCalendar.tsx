import FullCalendar from "@fullcalendar/react";
import React, { useCallback, useState } from "react";

import interactionPlugin, { EventReceiveArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
	CalendarOptions,
	DayHeaderContentArg,
	EventChangeArg,
	EventClickArg,
	EventContentArg,
	SlotLabelContentArg,
	SlotLaneContentArg,
} from "@fullcalendar/core";
import { shortWeekdays } from "@/utils/dates";
import { useSchedule } from "@/hooks/ScheduleContext";
import { formatTime } from "@/utils/formatTime";
interface DisciplineSchedule {
	discipline_id: number;
	quantity: number;
	weekday: number;
	start_time: string;
	end_time: string;
}
interface WeekCalendarProps extends CalendarOptions {}

export default function WeekCalendar({ ...props }: WeekCalendarProps) {
	const { newWeekSchedules, setNewWeekSchedules } = useSchedule();

	const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);

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

		const start = new Date(startStr) as any;
		const end = new Date(endStr) as any;
		const quantity = (end - start) / 60000 / 45;

		const scheduleStartHours = start?.getHours();
		const scheduleStartMinutes = start
			?.getMinutes()
			.toString()
			.padStart(2, "0");

		const scheduleEndHours = end?.getHours();
		const scheduleEndMinutes = end?.getMinutes().toString().padStart(2, "0");

		const scheduleTime = `${scheduleStartHours}:${scheduleStartMinutes} até 
		${scheduleEndHours}:${scheduleEndMinutes}`;

		return (
			<div
				{...props}
				className={`flex flex-1 justify-between flex-col p-3 text-white`}
			>
				<div>
					<span className="font-normal text-xs block">
						{quantity.toFixed(0)} {quantity > 1 ? "aulas" : "aula"}
					</span>

					<span className="font-semibold block overflow-hidden w-28">
						{title}
					</span>
				</div>
				<span className="font-normal text-xs">
					{isDragging ? timeText : scheduleTime}
				</span>
			</div>
		);
	};

	const onSelectSchedule = (props: EventClickArg) => {
		const id = props.event._def.defId;
		const alreadySelected = selectedSchedules.findIndex(
			(schedule_id) => schedule_id === id
		);
		const newSelectedSchedules = [...selectedSchedules];

		if (alreadySelected >= 0) {
			newSelectedSchedules.splice(alreadySelected, 1);
		} else {
			newSelectedSchedules.push(id);
		}

		setSelectedSchedules(newSelectedSchedules);
	};

	return (
		<FullCalendar
			ref={(ref) => console.log(ref)}
			allDaySlot={false}
			initialView="timeGridWeek"
			plugins={[timeGridPlugin, interactionPlugin]}
			droppable
			headerToolbar={false}
			nowIndicator={false}
			eventOverlap={false}
			weekends={false}
			height={"180vh"}
			slotMinTime={{
				hours: 13,
			}}
			slotMaxTime={{
				hours: 18,
			}}
			slotDuration={{
				minute: 5,
			}}
			eventClick={onSelectSchedule}
			dayHeaderContent={DayHeader}
			slotLabelContent={SlotLabel}
			slotLaneContent={(props: SlotLaneContentArg) => (
				<td className="bg-background-color !border-none" {...props}></td>
			)}
			eventClassNames={(props) => {
				const id = props.event._def.defId;
				const alreadySelected = selectedSchedules.findIndex(
					(schedule_id) => schedule_id === id
				);

				const selected = alreadySelected >= 0 ? "bg-warning" : "";

				return props.event.display !== "background"
					? `border-none rounded-lg ${selected}`
					: "bg-yellow-500";
			}}
			eventContent={ScheduleEvent}
			locale={"pt-BR"}
			editable
			{...props}
		/>
	);
}
