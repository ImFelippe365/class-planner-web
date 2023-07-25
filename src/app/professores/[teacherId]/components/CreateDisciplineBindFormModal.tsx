"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/Button";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SelectOptions } from "@/interfaces/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/services/api";
import { Course, Class, Discipline } from "@/interfaces/Course";
import Select from "@/components/Select";
import { TeacherDiscipline } from "@/interfaces/Teacher";
import { toast} from 'react-toastify'
import { formatDisciplineName } from "@/utils/formatDisciplineName";
interface CreateDisciplineBindFormModalProps {
	openModal: boolean;
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
	setDisciplines: React.Dispatch<React.SetStateAction<TeacherDiscipline[]>>;
	teacherId: number;
	refreshClasses: () => void;
	refreshWeekSchedules: () => void;
	refreshMonthSchedules: () => void;
}

interface CreateTeacherBinding {
	class_id: number;
	discipline_id: number;
	teacher_id?: number;
}

export default function CreateDisciplineBindFormModal({
	openModal,
	setOpenModal,
	teacherId,
	setDisciplines,
	refreshClasses,
	refreshWeekSchedules,
	refreshMonthSchedules,
}: CreateDisciplineBindFormModalProps): React.ReactNode {
	const [coursesOptions, setCoursesOptions] = useState<SelectOptions[]>([]);

	const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([]);
	const [disciplinesOptions, setDisciplinesOptions] = useState<SelectOptions[]>(
		[]
	);

	const [classes, setClasses] = useState<Class[]>([]);
	const [classesOptions, setClassesOptions] = useState<SelectOptions[]>([]);

	const schema = yup.object({
		course_id: yup.number().required("Campo curso é obrigatório"),
		class_id: yup.number().required("Campo turma é obrigatório"),
		discipline_id: yup.number().required("Campo disciplina é obrigatório"),
	});

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { isSubmitting, isSubmitSuccessful },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const getAllCourses = async () => {
		const { data } = await api.get("courses/");

		const newCourses = data.map(({ id, name }: Course) => {
			return { label: name, value: Number(id) };
		});

		setCoursesOptions(newCourses);
	};

	const getAllClasses = async () => {
		const { data } = await api.get(`classes/`);

		const classes = data.map(
			({ id, course, reference_period, shift }: Class) => {
				return {
					label: course.byname + reference_period + shift[0],
					value: Number(id),
				};
			}
		);

		setClasses(data);
		setClassesOptions(classes);
	};

	const getAllDisciplines = async () => {
		const { data } = await api.get(`disciplines/`);

		const disciplines = data.map(({ id, name }: Discipline) => {
			return { label: formatDisciplineName(name), value: Number(id) };
		});

		setAllDisciplines(data);
		setDisciplinesOptions(disciplines);
	};

	const filterDisciplinesOptions = (courseId: number) => {
		let filterOptions: Array<number> = [];

		for (let discipline of allDisciplines) {
			for (let course of discipline.course) {
				if (courseId === course.id) {
					filterOptions.push(discipline.id);
				}
			}
		}

		return disciplinesOptions.filter((discipline) =>
			filterOptions.includes(Number(discipline.value))
		);
	};

	const filterClassesOptions = (courseId: number, disciplineId: number) => {
		let filterOptions: Array<number> = [];
		const discipline = allDisciplines.find(
			(discipline) => discipline.id === disciplineId
		);
		const course = discipline?.course.find((course) => course.id === courseId);

		for (let object of classes) {
			if (
				object.course.id === courseId &&
				(object.reference_period === course?.period || discipline?.is_optional)
			) {
				filterOptions.push(object.id);
			}
		}

		return classesOptions.filter((item) =>
			filterOptions.includes(Number(item.value))
		);
	};

	const getTeacherDisciplines = async () => {
		const { data } = await api.get(`teachers/${teacherId}/disciplines/`);

		setDisciplines(data);
	};

	const onSubmit = async (newTeacherBinding: CreateTeacherBinding) => {
		try {
			newTeacherBinding.teacher_id = teacherId;

			const { data } = await api.post(
				"teachers/disciplines/",
				newTeacherBinding
			);
			
			toast.success("Vínculo criado com sucesso");
			refreshClasses();
			refreshWeekSchedules();
			refreshMonthSchedules();
		} catch (err) {
			toast.error(
				"Ocorreu um erro ao tentar vincular professor a esta disciplina"
			);
		}
	};

	useEffect(() => {
		getAllCourses();
		getAllClasses();
		getAllDisciplines();

		if (isSubmitSuccessful) {
			setOpenModal(false);
			reset();
			getTeacherDisciplines();
		}
	}, [isSubmitSuccessful, reset]);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<fieldset className="space-y-6">
					<Select
						containerClassName="mt-2"
						control={control}
						options={coursesOptions}
						name="course_id"
						placeholder="Selecione um Curso"
						label="Curso"
					/>

					<Select
						containerClassName="mt-2"
						control={control}
						disabled={!watch("course_id")}
						options={filterDisciplinesOptions(Number(watch("course_id")))}
						name="discipline_id"
						placeholder="Selecione uma disciplina"
						label="Disciplina"
					/>

					<Select
						containerClassName="mt-2"
						control={control}
						disabled={!watch("discipline_id")}
						options={filterClassesOptions(
							Number(watch("course_id")),
							Number(watch("discipline_id"))
						)}
						name="class_id"
						placeholder="Selecione uma turma"
						label="Turma"
					/>
				</fieldset>

				<fieldset className="flex gap-2 mt-4 justify-end">
					<Button isProcessing={isSubmitting} type="submit">
						Confirmar
					</Button>

					<Button
						color="failure"
						onClick={() => {
							reset();
							setOpenModal(false);
						}}
					>
						Cancelar
					</Button>
				</fieldset>
			</form>
		</>
	);
}
