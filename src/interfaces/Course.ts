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
