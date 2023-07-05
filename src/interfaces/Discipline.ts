export interface Discipline {
	id: number;
	name: string;
	code: string;
	workload_in_clock: number;
	workload_in_class: number;
	is_optional: boolean;
	course: {
		id: number;
		name: string;
		degree: string;
		course_load: number;
		byname: string;
		period: number;
	}[];
}


export interface CourseDiscipline{
	id: number;
	discipline: {
		id: number;
		name: string;
		degree: string;
		course_load: number;
		byname: string;
	};
	course_degree: string;
	period: number;
}