export interface EventSchedule {
	borderColor: string;
	textColor: string;
	backgroundColor: string;
	id: string;
	title: string;
	start_time: Date;
	end_time: Date;
	daysOfWeek: number[];
	extendedProps?: any;
}

export interface DisciplineSchedule {
	discipline_id: number;
	quantity: number;
	weekday: number;
	start_time: string;
	end_time: string;
	class_id?: number;
}

export interface CancelSchedule {
	schedule_id: number;
	canceled_date: string;
	reason?: string;
	quantity_available: number;
	is_available: boolean;
	teachers_id?: string[];
}

export interface CancelScheduleForm {
	canceled_date: Date;
	reason?: string | undefined;
	teachers_id?: string | undefined;
}
