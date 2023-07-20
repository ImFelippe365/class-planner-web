import { Class, Course, Discipline, Schedule } from "./Course";

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
	teach_class: Class;
}

export interface TeacherClasses {
	id: number;
	course_id: number;
	course: Course;
	reference_period: number;
	shift: string;
	class_leader_id: string | null;
}

export type TeacherRequestStatus = "Aceito" | "Pendente" | "Recusado";

export interface TeacherRequest {
	id: number;
	schedule_id: number;
	schedule: {
		id: number;
		quantity: number;
		weekday: number;
		start_time: string;
		end_time: string;
		class_id: number;
		discipline_id: number;
		discipline: Discipline;
		schedule_class: {
			id: number;
			course_id: number;
			course: Course;
			reference_period: number;
			shift: string;
			class_leader_id?: number | undefined;
		};
		requested_by: {
			id: number;
			registration: string;
			name: string;
			avatar: string | null;
			department: string;
			email: string;
		};
	};
	canceled_date: string;
	reason: string;
	canceled_by: number;
	teacher_to_replace: number;
	replace_class_status: TeacherRequestStatus;
	schedule_class: Class;
}
