"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { Course } from "@/interfaces/Course";
import { api } from "@/services/api";
import { degrees } from "@/utils/schedules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

interface EditCourseProps {
	params: {
		courseId: number;
	};
}

interface UpdateCourse {
	name: string;
	degree: string;
	course_load: number;
	byname: string;
}

export default function EditCourse({ params }: EditCourseProps) {
	document.title = 'Class Planner | Editar Curso'

	const [course, setCourse] = useState<Course>()

	const schema = yup.object({
		name: yup.string().required("Campo nome é obrigatório"),
		degree: yup.string().required("Campo grau é obrigatório"),
		course_load: yup.number().required("Campo carga horária é obrigatório"),
		byname: yup.string().required("Campo apelido é obrigatório"),
	});


	const router = useRouter();

	const onSubmit = async (editCourse: UpdateCourse) => {
		try {
			await api.put(`courses/${params.courseId}/`, editCourse);

			router.back();
			
			toast.success("Curso editado com sucesso")
		} catch (err) {
			toast.error("Erro ao tentar editar curso")
		}

	};

	const getCourse = async () => {
		const { data } = await api.get(`courses/${params.courseId}/`);

		setCourse(data)

		return data
	}

	const setDefaultValues = async () => {
		const data = await getCourse();

		Object.keys(data).forEach((field) => {
			// @ts-expect-error
			setValue(field, data[field]);
		});
	}

	const {
		control,
		handleSubmit,
		setValue,
		formState: { isSubmitting },
	} = useForm<UpdateCourse>({
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		setDefaultValues();
	}, [])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full">
			<Breadcrumb title="Editar curso" />

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="name"
				placeholder="Digite o nome do curso"
				label="Curso"
				defaultValue={course?.name}
			/>

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="byname"
				placeholder="Ex.: Info"
				label="Apelido"
				defaultValue={course?.byname}
			/>

			<Select
				containerClassName="mt-2"
				control={control}
				options={degrees}
				name="degree"
				placeholder="Selecione um grau"
				label="Grau"
				defaultValue={course?.degree}
			/>

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="course_load"
				placeholder="Insira a carga horária do curso"
				label="Carga horária"
				defaultValue={course?.course_load}
			/>

			<Button isProcessing={isSubmitting} className="w-full mt-4" type="submit">
				Confirmar
			</Button>
		</form>
	);
}
