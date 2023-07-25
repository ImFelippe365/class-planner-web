"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/services/api";

import Breadcrumb from "@/components/Breadcrumb";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";

import { Course, Discipline } from "@/interfaces/Course";
import { SelectOptions } from "@/interfaces/Utils";
import { reference_periods, reference_years } from "@/utils/schedules";
import { Checkbox, Label } from "flowbite-react";
import { CreateDiscipline } from "@/interfaces/Discipline";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface EditDisciplineProps {
	params: {
		disciplineId: number;
	};
}

export default function EditDiscipline({
	params,
}: EditDisciplineProps): React.ReactNode {
	document.title = "Class Planner - Editar disciplina";

	const [discipline, setDiscipline] = useState<Discipline>();
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
		is_optional: yup.boolean().notRequired(),
		course: yup
			.array(
				yup.object({
					course_id: yup.string().required("Campo curso é obrigatório"),
					period: yup.number().notRequired(),
				})
			)
			.min(1, "A disciplina precisa estar vinculada a pelo menos 1 curso")
			.max(
				courses.length,
				`O número máximo de cursos que podem estar associados a essa disciplina é ${courses.length}`
			),
	});

	const getDiscipline = async () => {
		const { data } = await api.get(`disciplines/${params.disciplineId}/`);

		setDiscipline(data);
		return data;
	};

	const setDefaultValues = async () => {
		const data = await getDiscipline();
		setNumSelectedCourses(data?.course.length);

		// @ts-expect-error
		setIsOptional(discipline?.is_optional);

		const courses = data.course.map((item: any, index: number) => {
			// setValue(`course.${index}.course_id`, item.id);
			// setValue(`course.${index}.period`, item.period ? item.period : 0);

			return {
				course_id: item.id,
				period: item.period,
			};
		});

		reset({
			code: data.code,
			is_optional: data.is_optional,
			name: data.name,
			workload_in_class: data.workload_in_class,
			workload_in_clock: data.workload_in_clock,
			course: courses,
		});
	};

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
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

	const { fields, append, remove, update } = useFieldArray({
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
		setDefaultValues();
		getAllCourses();
	}, []);

	const router = useRouter();

	const onSubmit = async (editDiscipline: CreateDiscipline) => {
		try {
			editDiscipline.workload_in_clock = Math.ceil(
				(editDiscipline.workload_in_class * 45) / 60
			);

			// @ts-expect-error
			editDiscipline.is_optional = discipline?.is_optional;

			if (discipline?.is_optional) {
				console.log("entrou");
				const courses = editDiscipline.course.map((item) => ({
					...item,
					period: null,
				}));

				editDiscipline.course = courses;
			}

			const { data } = await api.put(
				`disciplines/${discipline?.id}/`,
				editDiscipline
			);

			router.back();
			toast.success("Disciplina editada com sucesso");
		} catch (err) {
			toast.error("Ocorreu um erro ao tentar editar disciplina");
		}
	};

	return (
		<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
			<Breadcrumb title="Editar disciplina" />

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="name"
				placeholder="Digite o nome da disciplina"
				label="Nome"
				defaultValue={discipline?.name}
			/>

			<p className="mt-2 font-[0.85rem]">
				{discipline?.is_optional ? "É optativa" : "É obrigatória"}
			</p>

			<Input
				containerClassName="mt-2"
				control={control}
				type="text"
				name="code"
				placeholder="Ex: TEC.19110"
				label="Código"
				defaultValue={discipline?.code}
				disabled
			/>

			<Input
				containerClassName="mt-2"
				control={control}
				type="number"
				name="workload_in_class"
				placeholder="Digite a carga horária da disciplina"
				label="Carga horária (aula)"
				defaultValue={discipline?.workload_in_class}
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
									disabled={index < discipline?.course.length}
								/>

								{!isOptional && (
									<Select
										containerClassName="mt-2"
										control={control}
										disabled={!watch(`course.${index}.course_id`)}
										options={
											discipline?.course[index]
												? courses?.find(({ id }) => {
														return id == discipline?.course[index].id;
												  })?.degree === "Ensino superior"
													? reference_periods
													: reference_years
												: courses?.find(({ id }) => {
														return (
															id.toString() ===
															watch(`course.${index}.course_id`)
														);
												  })?.degree === "Ensino superior"
												? reference_periods
												: reference_years
										}
										name={`course.${index}.period`}
										placeholder={`Selecione um ${
											courses?.find(
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

							{index >= discipline?.course.length && (
								<Button color="failure" className="h-full">
									<Trash2
										className=""
										onClick={() => removeCourseLink(index)}
									/>
								</Button>
							)}
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
