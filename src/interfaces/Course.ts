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
	reference_period: number;
	shift: Shifts;
	class_leader_id?: number;
}


export interface Discipline {
	code: string,
	id: number,
	course_period: {
		course_id: number,
		period: number,
	}[]
	is_optional: boolean,
	name: string,
	workload_in_class: number,
	workload_in_clock: number,
}
