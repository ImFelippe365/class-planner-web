export interface CreateTeacher {
	registration: string;
	name: string;
	department: string;
}

export interface Teacher {
	id: number;
	avatar: string;
	registration: string;
	name: string;
	department: string;
	email: string;
}

export interface TeacherDiscipline {
	id: number;
	discipline: {
		id: number;
		name: string;
		code: string;
		workload_in_class: number;
		workload_in_clock: number;
		is_optional: boolean;
	};
	course: {
		id: number;
		name: string;
		degree: string;
		course_load: number;
		byname: string;
		period: number;
	};
}