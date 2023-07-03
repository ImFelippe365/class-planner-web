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
	class_leader_id?: number;
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
	code: string;
	id: number;
	course_period: {
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
