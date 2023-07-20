import { Teacher } from "@/interfaces/Teacher";
import { DisciplineGlobal } from "@/interfaces/Discipline";
import { Class } from "./Course";
export interface Student {
	id: number;
	name: string;
	registration: string;
	avatar: string;
	class_id: number;
	student_class: Class;
	email: string;
	disciplines: string[];
}

export interface Alert {
	id: number;
	teacher_id: number;
	student_id: number;
	discipline_id: number;
	created_at: string;
	reason: string;
	teacher: Teacher;
	student: Student;
	discipline: DisciplineGlobal;
}
