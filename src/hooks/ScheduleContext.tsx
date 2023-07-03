import { CreateTeacher } from "@/interfaces/Teacher";
import { api, suapApi } from "@/services/api";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { eventColors } from "@/utils/eventColors";
import { EventReceiveArg } from "@fullcalendar/interaction";
import { formatTime } from "@/utils/formatTime";
import { EventChangeArg } from "@fullcalendar/core";
import { intervalEvents } from "@/utils/intervalEvents";
import { shiftsSchedule } from "@/utils/schedules";

interface ScheduleProviderProps {
	children: React.ReactNode;
}

interface DisciplineSchedule {
	discipline_id: number;
	quantity: number;
	weekday: number;
	start_time: string;
	end_time: string;
}

interface EventSchedule {
	borderColor: string;
	textColor: string;
	backgroundColor: string;
	id: string;
	title: string;
	start: Date;
	end: Date;
	weekday: number[];
}

interface ScheduleContextValues {
	weekSchedules: EventSchedule[];
	setWeekSchedules: React.Dispatch<React.SetStateAction<EventSchedule[]>>;

	monthSchedules: EventSchedule[];
	setMonthSchedules: React.Dispatch<React.SetStateAction<EventSchedule[]>>;

	newWeekSchedules: DisciplineSchedule[];
	setNewWeekSchedules: React.Dispatch<
		React.SetStateAction<DisciplineSchedule[]>
	>;
	editableMode: boolean;
	setEditableMode: React.Dispatch<React.SetStateAction<boolean>>;

	getWeekSchedules: (class_id: string) => Promise<void>;
	getMonthSchedules: (class_id: string) => Promise<void>;
}

const ScheduleContext = createContext({} as ScheduleContextValues);

const ScheduleProvider = ({ children }: ScheduleProviderProps) => {
	const [weekSchedules, setWeekSchedules] = useState<EventSchedule[]>([
		{
			id: "1",
			title: "Evento 1",
			start: new Date("2023-06-29 13:00"),
			end: new Date("2023-06-29 14:20"),
			weekday: [0],
			...eventColors.normal,
		},
	]);
	const [monthSchedules, setMonthSchedules] = useState<EventSchedule[]>([]);

	const [newWeekSchedules, setNewWeekSchedules] = useState<
		DisciplineSchedule[]
	>([]);

	const [editableMode, setEditableMode] = useState(false);

	const getWeekSchedules = useCallback(async (class_id: string) => {
		try {
			const { data } = await api.get(`/classes/${class_id}/schedules/week/`);

			setWeekSchedules([data, ...(intervalEvents as any)]);
		} catch (error) {
			console.warn("Erro ao requisitar os horários da semana  ->", error);
		}
	}, []);

	const getMonthSchedules = useCallback(async (class_id: string) => {
		try {
			const { data } = await api.get(`/classes/${class_id}/schedules/month/`);

			setMonthSchedules(data);
		} catch (error) {
			console.warn("Erro ao requisitar os horários do mês ->", error);
		}
	}, []);


	const contextValues = {
		weekSchedules,
		setWeekSchedules,
		monthSchedules,
		setMonthSchedules,
		newWeekSchedules,
		setNewWeekSchedules,
		editableMode,
		setEditableMode,

		getWeekSchedules,
		getMonthSchedules,
	};

	return (
		<ScheduleContext.Provider value={contextValues}>
			{children}
		</ScheduleContext.Provider>
	);
};

const useSchedule = () => {
	const context = useContext(ScheduleContext);

	return context;
};

export { useSchedule, ScheduleProvider };
