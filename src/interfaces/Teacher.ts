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
