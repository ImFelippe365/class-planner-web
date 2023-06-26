"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { api } from "@/services/api";
import { degrees } from "@/utils/schedules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface CreateCourse {
	name: string;
	degree: string;
	course_load: number;
	byname: string;
}

export default function AddCourse() {
	const schema = yup.object({
		name: yup.string().required("Campo nome é obrigatório"),
		degree: yup.string().required("Campo grau é obrigatório"),
		course_load: yup.number().required("Campo carga horária é obrigatório"),
		byname: yup.string().required("Campo apelido é obrigatório"),
	});

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<CreateCourse>({
		resolver: yupResolver(schema),
	});

	const router = useRouter();

	const onSubmit = async (newCourse: CreateCourse) => {
		const { data } = await api.post("courses/", newCourse);

		console.log(data);

		router.back();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full">
			<Breadcrumb title="Cadastrar curso" />

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="name"
				placeholder="Digite o nome do curso"
				label="Curso"
			/>

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="byname"
				placeholder="Ex.: Info"
				label="Apelido"
			/>

			<Select
				containerClassName="mt-2"
				control={control}
				options={degrees}
				name="degree"
				placeholder="Selecione um grau"
				label="Grau"
			/>

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="course_load"
				placeholder="Insira a carga horária do curso"
				label="Carga horária"
			/>

			<Button isProcessing={isSubmitting} className="w-full mt-4" type="submit">
				Confirmar
			</Button>
		</form>
	);
}
