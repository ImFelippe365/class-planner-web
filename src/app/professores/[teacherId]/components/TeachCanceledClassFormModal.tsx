import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SelectOptions } from "@/interfaces/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/services/api";
import Select from "@/components/Select";
import { TeacherDiscipline } from "@/interfaces/Teacher";
import Button from "@/components/Button";
import { ClassCanceled } from "@/interfaces/Course";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from 'react-toastify'
import { formatDisciplineName } from "@/utils/formatDisciplineName";

interface TeachCanceledClassFormModalProps {
	openModal: boolean;
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
	teacherId: number;
	classCanceled?: ClassCanceled;
	refreshSchedules: () => void;
}

interface CreateTemporaryClass {
	class_canceled_id?: number;
	discipline_id: number;
	teacher_id?: number;
}

export default function TeachCanceledClassFormModal({
	openModal,
	setOpenModal,
	teacherId,
	classCanceled,
	refreshSchedules
}: TeachCanceledClassFormModalProps): React.ReactNode {
	const { user } = useAuth();

	const [disciplinesLoggedTeacher, setDisciplinesLoggedTeacher] = useState<
		TeacherDiscipline[]
	>([]);
	const [disciplinesOptions, setDisciplinesOptions] = useState<SelectOptions[]>(
		[]
	);

	const schema = yup.object({
		discipline_id: yup.number().required("Campo disciplina é obrigatório"),
	});

	const getDisciplinesLoggedTeacher = async () => {
		const { data } = await api.get(`teachers/${user?.id}/disciplines/`);

		const disciplines = data.map(({ id, discipline }: TeacherDiscipline) => {
			return { label: formatDisciplineName(discipline.name), value: Number(discipline.id) };
		});

		setDisciplinesLoggedTeacher(data);
		setDisciplinesOptions(disciplines);
	};

	const filterDisciplinesOptions = (classId: number | undefined) => {
		let filterOptions: Array<number> = [];

		for (let discipline of disciplinesLoggedTeacher) {
			if (classId == discipline.teach_class.id) {
				filterOptions.push(discipline.discipline.id);
			}
		}

		return disciplinesOptions.filter((discipline) =>
			filterOptions.includes(Number(discipline.value))
		);
	};

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting, isSubmitSuccessful },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (newTemporaryClass: CreateTemporaryClass) => {
		try {
			newTemporaryClass.teacher_id = user?.id;
			newTemporaryClass.class_canceled_id = classCanceled?.id;

			const { data } = await api.post("temporary-classes/", newTemporaryClass);

			refreshSchedules()
			toast.success("Sucesso! Agora você ministrará esta aula");
		} catch (err) {
			toast.error("Ocorreu um erro ao tentar substituir aula");
		}
	};

	useEffect(() => {
		getDisciplinesLoggedTeacher();

		if (isSubmitSuccessful) {
			setOpenModal(false);
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
				<fieldset>
					<Select
						containerClassName="mt-2"
						control={control}
						options={filterDisciplinesOptions(classCanceled?.schedule_class.id)}
						name="discipline_id"
						placeholder="Selecione uma disciplina"
						label="Disciplina"
					/>
				</fieldset>

				<fieldset className="flex self-end gap-4">
					<Button
						className="mt-5"
						color="failure"
						onClick={() => {
							reset();
							setOpenModal(false);
						}}
					>
						Cancelar
					</Button>
					<Button type="submit" isProcessing={isSubmitting} className="mt-5">
						Confirmar
					</Button>
				</fieldset>
			</form>
		</>
	);
}
