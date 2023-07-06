import FullCalendar from "@fullcalendar/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import interactionPlugin, { EventReceiveArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
	CalendarApi,
	CalendarOptions,
	DayHeaderContentArg,
	EventChangeArg,
	EventClickArg,
	EventContentArg,
	SlotLabelContentArg,
	SlotLaneContentArg,
} from "@fullcalendar/core";
import { shortWeekdays, weekdays } from "@/utils/dates";
import { useSchedule } from "@/hooks/ScheduleContext";
import Button from "./Button";
import { Ban, Clock, Trash, User } from "lucide-react";
import { Calendar } from "lucide-react";
import { Schedule } from "@/interfaces/Course";
import Image from "next/image";

interface SelectedSchedule {
	id: string;
	removeEvent: () => void;
}

interface WeekCalendarProps extends CalendarOptions {
	getCalendarRef: (ref: any) => void;
	clickable?: boolean;
}

export default function WeekCalendar({
	getCalendarRef,
	clickable,
	...props
}: WeekCalendarProps) {
	const calendarRef = useRef<any>(null);
	// const { newWeekSchedules, setNewWeekSchedules } = useSchedule();

	const [selectedSchedules, setSelectedSchedules] = useState<
		SelectedSchedule[]
	>([]);

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
			<>
				<div
					{...props}
					className={`flex flex-1 z-40 justify-between flex-col p-3 text-white relative ${
						clickable && "cursor-pointer"
					}`}
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
			</>
		);
	};

	const onSelectSchedule = (props: EventClickArg) => {
		if (props.event.display === "background") return;

		const selectedEvent = {
			id: props.event.id,
			removeEvent: props.event.remove,
		};
		const alreadySelected = selectedSchedules.findIndex(
			(schedule) => schedule.id === selectedEvent.id
		);
		const newSelectedSchedules = [...selectedSchedules];

		if (alreadySelected >= 0) {
			newSelectedSchedules.splice(alreadySelected, 1);
		} else {
			newSelectedSchedules.push(selectedEvent);
		}

		setSelectedSchedules(newSelectedSchedules);
	};

	const removeSelectedSchedules = () => {
		selectedSchedules.forEach((element) => {
			const eventExists = calendarRef?.current
				.getApi()
				.getEventById(element.id);

			if (eventExists) {
				eventExists.remove();
			}
		});

		setSelectedSchedules([]);
	};

	useEffect(() => {
		if (selectedSchedules.length > 0) setSelectedSchedules([]);
	}, [props.editable]);

	return (
		<div>
			{selectedSchedules.length > 0 && (
				<section className="flex items-center justify-between bg-primary py-2 px-4 rounded-xl mb-3">
					<span className="text-base text-white ">
						Selecionado {selectedSchedules.length} horários
					</span>
					<Button
						onClick={() => removeSelectedSchedules()}
						size="xs"
						className="transparent"
						color="failure"
					>
						<Trash size={16} className="text-white mr-2" />
						<span>Remover</span>
					</Button>
				</section>
			)}
			<FullCalendar
				ref={(ref) => {
					calendarRef.current = ref;
					getCalendarRef(ref);
				}}
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
				eventClick={
					props.editable
						? onSelectSchedule
						: clickable
						? props.eventClick
						: () => {}
				}
				dayHeaderContent={DayHeader}
				slotLabelContent={SlotLabel}
				slotLaneContent={(props: SlotLaneContentArg) => (
					<td className="bg-background-color !border-none" {...props}></td>
				)}
				eventClassNames={(props) => {
					const id = props.event.id;
					const alreadySelected = selectedSchedules.findIndex(
						(schedule) => schedule.id === id
					);

					const selected = alreadySelected >= 0 ? "opacity-50" : "";

					return props.event.display !== "background"
						? `border-none rounded-lg ${selected} !z-40`
						: "bg-yellow-500";
				}}
				eventContent={ScheduleEvent}
				locale={"pt-BR"}
				editable
				{...props}
			/>
		</div>
	);
}
