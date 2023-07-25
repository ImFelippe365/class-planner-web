import { Student } from "./Student";

export interface Course {
	id: number;
	name: string;
	degree: string;
	course_load: number;
	byname: string;
}

export type Shifts = "Manhã" | "Tarde" | "Noite";

export interface Class {
	id: number;
	course_id: number;
	course: Course;
	reference_period: number;
	shift: Shifts;
	class_leader_id?: string;
	class_leader?: Student
}

interface TaughtBy {
	id: number;
	registration: number;
	name: string;
	avatar: string;
	department: string;
	email: string;
}

export interface Discipline {
	id: number;
	code: string;
	course: {
		id: number;
		name: string;
		degree: string;
		course_load: number;
		byname: string;
		period: number;
	}[];
	is_optional: boolean;
	name: string;
	workload_in_class: number;
	workload_in_clock: number;
	taught_by: TaughtBy[];
}

export interface Schedule {
	id: number;
	quantity: number;
	weekday: number;
	start_time: string;
	end_time: string;
	class_id: number;
	schedule_class: Class;
	discipline_id: number;
	discipline: Discipline;
	canceled_class: ClassCanceled;
	class_to_replace: any;
	class_date: any;
}

export interface ClassCanceled {
	id: number;
	schedule_id: number;
	schedule_class: {
		id: number;
		course_id: number;
		course: Course;
		reference_period: number;
		shift: Shifts;
		class_leader_id?: string;
	};
	canceled_date: Date,
	reason: string | null,
	is_available: boolean,
	quantity_available: number;
}
