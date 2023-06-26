"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { Course } from "@/interfaces/Course";
import { SelectOptions } from "@/interfaces/Utils";
import { api } from "@/services/api";
import { reference_periods, reference_years, shifts } from "@/utils/schedules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface CreateClass {
	course_id: string;
	reference_period: number;
	shift: string;
	class_leader_id: number;
}

export default function AddClass() {
	const schema = yup.object({
		shift: yup.string().required("Campo turno é obrigatório"),
		reference_period: yup
			.number()
			.typeError("Selecione uma opção")
			.required("Campo período de referência é obrigatório"),
		course_id: yup.string().required("Campo curso é obrigatório"),
		class_leader_id: yup.number().typeError("Selecione uma opção"),
	});

	const {
		control,
		handleSubmit,
		watch,
		formState: { isSubmitting },
	} = useForm<CreateClass>({
		resolver: yupResolver(schema),
	});

	const router = useRouter();

	const [courses, setCourses] = useState<Course[]>([]);
	const [coursesOptions, setCoursesOptions] = useState<SelectOptions[]>([]);
	const [studentsOptions, setStudentOptions] = useState<SelectOptions[]>([]);

	const getAllCourses = async () => {
		const { data } = await api.get("courses/");

		const newCourses = data.map(({ id, name }: Course) => {
			return { label: name, value: Number(id) };
		});

		setCourses(data);
		setCoursesOptions(newCourses);
	};

	const getAllStudents = async () => {
		const { data } = await api.get("students/");

		const newStudents = data.map(({ id, name }: Student) => {
			return { label: name, value: id };
		});

		setStudentOptions([{ label: "Nenhum", value: 0 }, ...newStudents]);
	};

	useEffect(() => {
		getAllCourses();
		getAllStudents();
	}, []);

	const onSubmit = async (newClass: CreateClass) => {
		const { data } = await api.post("classes/", newClass);

		console.log(data);

		router.back();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full">
			<Breadcrumb title="Cadastrar turma" />

			<Select
				containerClassName="mt-2"
				control={control}
				options={coursesOptions}
				name="course_id"
				placeholder="Selecione um curso"
				label="Curso"
			/>

			<Select
				containerClassName="mt-2"
				control={control}
				options={shifts}
				name="shift"
				placeholder="Selecione um turno"
				label="Turno"
			/>

			<Select
				containerClassName="mt-2"
				control={control}
				disabled={!watch("course_id")}
				options={
					courses?.find(({ id }) => id.toString() === watch("course_id"))
						?.degree === "Ensino superior"
						? reference_periods
						: reference_years
				}
				name="reference_period"
				placeholder="Selecione um período de referência"
				label="Período de referência"
			/>

			<Select
				containerClassName="mt-2"
				control={control}
				disabled={!watch("course_id")}
				options={studentsOptions}
				name="class_leader_id"
				placeholder="Selecione um líder de turma"
				label="Líder de turma"
			/>

			<Button isProcessing={isSubmitting} className="w-full mt-4" type="submit">
				Confirmar
			</Button>
		</form>
	);
}
