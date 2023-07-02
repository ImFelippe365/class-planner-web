"use client"

import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { Control, Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/services/api";

import Breadcrumb from "@/components/Breadcrumb";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";

import { Course } from "@/interfaces/Course";
import { SelectOptions } from "@/interfaces/Utils";
import { reference_periods, reference_years } from "@/utils/schedules";
import { Checkbox, CheckboxProps, Label } from "flowbite-react";

interface CreateDiscipline {
	name: string;
	code: string;
	workload_in_class: number;
	workload_in_clock: number;
	is_optional: boolean;
	course: {
		course_id: string;
		period: number;
	}[];
}

export default function AddDiscipline(): React.ReactNode {
	const schema = yup.object({
		name: yup.string().required("Campo nome é obrigatório"),
		code: yup.string().required("Campo código é obrigatório"),
		workload_in_class: yup.number().required("Campo carga horária é obrigatório"),
		is_optional: yup.boolean().required("Campo tipo é obrigatório"),
		course: yup.array(yup.object({
			course_id: yup.string().required("Campo curso é obrigatório"),
			period: yup.number().required("Campo período é obrigatório")
		})).min(1, 'A disciplina precisa estar vinculada a pelo menos 1 curso'),
	});

	const {
		control,
		handleSubmit,
		watch,
		formState: { isSubmitting },
	} = useForm<CreateDiscipline>({
		resolver: yupResolver(schema),
	});

	const [courses, setCourses] = useState<Course[]>([]);
	const [coursesOptions, setCoursesOptions] = useState<SelectOptions[]>([]);


	const { fields, append } = useFieldArray({
		control,
		name: 'course',
	})

	function addCourseLink(data: any) {
		append({ course_id: '', period: 0 })
	}

	//const router = useRouter();

	const onSubmit = async (newDiscipline: CreateDiscipline) => {
		const { data } = await api.post("disciplines/", newDiscipline);

		console.log(data);

		//router.back();
	};

	const getAllCourses = async () => {
		const { data } = await api.get("courses/");

		const newCourses = data.map(({ id, name }: Course) => {
			return { label: name, value: Number(id) };
		});

		setCourses(data);
		setCoursesOptions(newCourses);
	};

	useEffect(() => {
		getAllCourses();
	}, [])

	return (
		<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
			<Breadcrumb title="Cadastrar disciplina" />

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="name"
				placeholder="Digite o nome da disciplina" label="Nome"
			/>

			<div className="mt-2">
				<input
					type="checkbox"
					name="is_optional"
					id="is_optional"
					className="rounded"
				/>

				<Label htmlFor="is_optional" value=	"É optativa" />
			</div>

			{/* <Controller
				name="is_optional"
				control={control}
				render={({
					fieldState: { error },
				}) => (
					<div className="mt-2 flex ">

						<div className="flex gap-2">
							<Checkbox
								id="is_optional"
							/>
							<Label
								color={error ? "failure" : "" || "gray"}
								htmlFor={"is_optional"}
								value="É optativa"
							/>
						</div>
					</div>
				)}
			/> */}


			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="code"
				placeholder="Ex: TEC.19110" label="Código"
			/>

			<Input
				containerClassName="mt-2"
				control={control}
				type="number"
				name="workload_in_class"
				placeholder="Digite a carga horária da disciplina" label="Carga horária (aula)"
			/>

			<div>
				<span>Cursos associados</span>
				<Button
					className="mt-2 w-fit self-end"
					onClick={addCourseLink}>
					Adicionar curso para disciplina
				</Button>

				{fields.map((field, index) => {
					return (
						<div key={field.id}>
							<Select
								containerClassName="mt-2"
								control={control}
								options={coursesOptions}
								name={`course.${index}.course_id`}
								placeholder="Selecione um curso"
								label="Curso"
							/>

							<Select
								containerClassName="mt-2"
								control={control}
								disabled={!watch(`course.${index}.course_id`)}
								options={
									courses?.find(({ id }) => id.toString() === watch(`course.${index}.course_id`))
										?.degree === "Ensino superior"
										? reference_periods
										: reference_years
								}
								name={`course.${index}.period`}
								placeholder={`Selecione um ${courses?.find(({ id }) => id.toString() === watch(`course.${index}.course_id`))
									?.degree === "Ensino superior"
									? 'período'
									: 'ano'}
								 de referência`}
							/>
						</div>
					)
				})}
			</div>

			<Button isProcessing={isSubmitting} className="w-full mt-4" type="submit">
				Confirmar
			</Button>
		</form>
	)
}