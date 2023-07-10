"use client";

import React, { useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";

import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CancelSchedule, CancelScheduleForm } from "@/interfaces/Schedule";
import Input from "@/components/Input";
import MonthCalendar from "@/components/MonthCalendar";
import Select from "@/components/Select";
import { useGlobal } from "@/hooks/GlobalContext";
import { Schedule } from "@/interfaces/Course";

interface CancelScheduleFormModalProps {
	schedule: Schedule | undefined;
}

export default function CancelScheduleFormModal({
	schedule,
}: CancelScheduleFormModalProps) {
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
		teachers_id: yup.string(),
	});

	const {
		control,
		handleSubmit,
		watch,
		formState: { isSubmitting },
	} = useForm<CancelScheduleForm>({
		resolver: yupResolver<CancelScheduleForm>(schema),
	});

	const onSubmit = (data: CancelScheduleForm) => {
		
	};

	return (
		<form
			className="grid grid-cols-container gap-6"
			onSubmit={(e) => e.preventDefault()}
		>
			<section className="flex flex-col gap-3">
				<Select
					label="Substituir com professor"
					options={[
						{
							label: "Nenhum",
							value: "",
						},
						...teachersSelection,
					]}
					name="teachers_id"
					control={control}
				/>
				<Input
					label="Motivo do cancelamento"
					type="text"
					name="reason"
					multiple
					control={control}
				/>
			</section>
			<Controller
				name="canceled_date"
				control={control}
				render={({ field }) => <MonthCalendar onDatePress={() => {}} />}
			/>
		</form>
	);
}
