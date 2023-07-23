"use client";

import { useRouter } from "next/navigation";
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
import { Checkbox, Label } from "flowbite-react";
import { CreateDiscipline } from "@/interfaces/Discipline";
import { TestTube, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { stringify } from "querystring";

export default function AddDiscipline(): React.ReactNode {
	document.title = "Class Planner - Nova disciplina";

	const [courses, setCourses] = useState<Course[]>([]);
	const [coursesOptions, setCoursesOptions] = useState<SelectOptions[]>([]);
	const [isOptional, setIsOptional] = useState(false);
	const [numSelectedCourses, setNumSelectedCourses] = useState(0);

	const schema = yup.object({
		name: yup.string().required("Campo nome é obrigatório"),
		code: yup.string().required("Campo código é obrigatório"),
		workload_in_class: yup
			.number()
			.positive()
			.required("Campo carga horária é obrigatório"),
		is_optional: yup.boolean(),
		course: yup
			.array(
				yup.object({
					course_id: yup.string().required("Campo curso é obrigatório"),
					period: yup
						.number()
						.notRequired()
				})
			)
			.min(1, "A disciplina precisa estar vinculada a pelo menos 1 curso")
			.max(
				courses.length,
				`O número máximo de cursos que podem estar associados a essa disciplina é ${courses.length}`
			),
	});

	const {
		control,
		handleSubmit,
		watch,
		formState: { isSubmitting },
	} = useForm<CreateDiscipline>({
		resolver: yupResolver(schema),
	});

	const filterOptions = (index: number) => {
		let selectedCourses: Array<number> = [];

		for (let i = 0; i < index; i++) {
			selectedCourses.push(Number(watch(`course.${i}.course_id`)));
		}

		return coursesOptions.filter(
			(item) => !selectedCourses.includes(Number(item.value))
		);
	};

	const { fields, append, remove } = useFieldArray({
		control,
		name: "course",
	});

	const getAllCourses = async () => {
		const { data } = await api.get("courses/");

		const newCourses = data.map(({ id, name }: Course) => {
			return { label: name, value: Number(id) };
		});

		setCourses(data);
		setCoursesOptions(newCourses);
	};

	function addCourseLink(data: any) {
		if (courses.length > numSelectedCourses) {
			append({ course_id: "", period: 0 });
			setNumSelectedCourses(numSelectedCourses + 1);
		}
	}

	function removeCourseLink(index: number) {
		remove(index);
		setNumSelectedCourses(numSelectedCourses - 1);
	}

	useEffect(() => {
		getAllCourses();
	}, []);

	const router = useRouter();

	const onSubmit = async (newDiscipline: CreateDiscipline) => {
		try {
			newDiscipline.workload_in_clock = Math.ceil(
				(newDiscipline.workload_in_class * 45) / 60
			);
			newDiscipline.is_optional = isOptional;

			if (isOptional) {
				const courses = newDiscipline.course.map((item) => (
					{ ...item, period: null }
				))

				newDiscipline.course = courses
			}

			const resquest = await api.post("disciplines/", newDiscipline);

			router.back();
			
			toast.success("Disciplina criada com sucesso");
		} catch (err: any) {
			const obj = JSON.parse(err['request']['response'])
			if ("code" in obj) {

				//toast.error(obj['code'][0]);
				toast.error("Disciplina com esse código já existe");
			} else {
				toast.error("Ocorreu um erro ao tentar criar nova disciplina");
			}
			toast.error(err);
		}
	};

	return (
		<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
			<Breadcrumb title="Cadastrar disciplina" />

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="name"
				placeholder="Digite o nome da disciplina"
				label="Nome"
			/>

			<Controller
				name="is_optional"
				control={control}
				render={({
					field: { onBlur, onChange, ref },
					formState,
					fieldState: { error },
				}) => (
					<div className="mt-2 flex">
						<div className="flex gap-2">
							<Checkbox
								id="is_optional"
								onChange={() => setIsOptional(!isOptional)}
							/>
							<Label
								color={error ? "failure" : "" || "gray"}
								htmlFor={"is_optional"}
								value="É optativa"
							/>
							{error?.message}
						</div>
					</div>
				)}
			/>

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="code"
				placeholder="Ex: TEC.19110"
				label="Código"
			/>

			<Input
				containerClassName="mt-2"
				control={control}
				type="number"
				name="workload_in_class"
				placeholder="Digite a carga horária da disciplina"
				label="Carga horária (aula)"
			/>

			<div className="flex flex-col gap-6">
				<div className="mt-3 flex justify-between items-center">
					<span className="font-semibold text-lg text-primary-dark flex-wrap">
						Cursos associados
					</span>
					<Button className="w-fit self-end" onClick={addCourseLink}>
						Adicionar curso para disciplina
					</Button>
				</div>

				{fields.map((field, index) => {
					return (
						<div
							key={field.id}
							className="flex justify-between items-center gap-4 bg-primary-background rounded-lg p-4 pt-2"
						>
							<div className="w-full">
								<Select
									containerClassName="mt-2"
									control={control}
									options={filterOptions(index)}
									name={`course.${index}.course_id`}
									placeholder="Selecione um curso"
									label="Curso"
								/>

								{!isOptional && (
									<Select
										containerClassName="mt-2"
										control={control}
										disabled={!watch(`course.${index}.course_id`)}
										options={
											courses?.find(
												({ id }) =>
													id.toString() === watch(`course.${index}.course_id`)
											)?.degree === "Ensino superior"
												? reference_periods
												: reference_years
										}
										name={`course.${index}.period`}
										placeholder={`Selecione um ${courses?.find(
											({ id }) =>
												id.toString() === watch(`course.${index}.course_id`)
										)?.degree === "Ensino superior"
											? "período"
											: "ano"
											}
								 	de referência`}
										label="Período de	 referência"
									/>
								)}
							</div>

							<Button color="failure" className="h-full">
								<Trash2 className="" onClick={() => removeCourseLink(index)} />
							</Button>
						</div>
					);
				})}
			</div>

			<Button isProcessing={isSubmitting} className="w-full my-4" type="submit">
				Confirmar
			</Button>
		</form>
	);
}
