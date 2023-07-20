"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";

import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CancelSchedule, CancelScheduleForm } from "@/interfaces/Schedule";
import Input from "@/components/Input";
import MonthCalendar from "@/components/MonthCalendar";
import Select from "@/components/Select";
import { useGlobal } from "@/hooks/GlobalContext";
import { Schedule } from "@/interfaces/Course";
import { Check } from "lucide-react";
import { api } from "@/services/api";
import TextArea from "@/components/TextArea";

interface CancelScheduleFormModalProps {
	schedule: Schedule | undefined;
	closeModal: () => void;
	refreshSchedules: (date: Date) => void;
}

interface CalendarControllerProps {
	field: ControllerRenderProps<CancelScheduleForm, "canceled_date">;
}

export default function CancelScheduleFormModal({
	schedule,
	closeModal,
	refreshSchedules,
}: CancelScheduleFormModalProps) {
	const defaultDate = new Date(
		`${schedule?.class_date} ${schedule?.start_time}`
	);
	const { teachers } = useGlobal();

	const teachersSelection = teachers.map((teacher) => {
		return {
			label: teacher.name,
			value: teacher.id.toString(),
		};
	});

	const schema = yup.object({
		canceled_date: yup
			.date()
			.required("Selecione uma data que quer cancelar a aula"),
		reason: yup.string(),
		teacher_to_replace: yup.string(),
	});

	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { isSubmitting },
	} = useForm<CancelScheduleForm>({
		resolver: yupResolver<CancelScheduleForm>(schema),
		defaultValues: {
			canceled_date: defaultDate,
		},
	});

	const onSubmit = async (data: CancelScheduleForm) => {
		const newData: CancelSchedule = {
			canceled_date: data.canceled_date?.toLocaleString().split(",")[0],
			reason: data.reason,
			teachers_to_substitute: data.teacher_to_replace
				? data.teacher_to_replace
				: "",
			canceled_by: 1,
			schedule_id: schedule?.id || 0,
		};

		try {
			const response = await api.post("/schedules/canceled/", newData);

			closeModal();
			refreshSchedules(data.canceled_date);
		} catch (err) {
			console.log("Erro ao tentar cancelar horário de aula", err);
		}
	};

	const Calendar = useCallback(
		({ field }: CalendarControllerProps) => {
			return (
				<MonthCalendar
					singleActiveDay={(schedule?.weekday || 0) + 1}
					defaultSelectedDate={schedule?.class_date && defaultDate}
					onDatePress={(date) => field.onChange(date)}
				/>
			);
		},
		[schedule?.class_date]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<section className="grid grid-cols-container gap-6">
				<div className="flex flex-col gap-6">
					<Select
						label="Substituir com professor"
						options={[
							{
								label: "Nenhum",
								value: "",
							},
							...teachersSelection,
						]}
						name="teacher_to_replace"
						control={control}
					/>
					<TextArea
						label="Motivo do cancelamento"
						name="reason"
						placeholder="Comente o motivo por estar cancelando (opcional)"
						className="text-sm"
						control={control}
						rows={4}
					/>
				</div>
				<Controller
					name="canceled_date"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<div>
							<Calendar field={field} />
							{error && <p className="text-error text-sm">{error.message}</p>}
						</div>
					)}
				/>
			</section>

			<section className="flex justify-end gap-6">
				<Button isProcessing={isSubmitting} className="mt-6" type="submit">
					{!isSubmitting && <Check className="mr-2 text-white" />}
					<span>Cancelar aula</span>
				</Button>
			</section>
		</form>
	);
}
