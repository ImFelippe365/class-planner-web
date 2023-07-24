import { SelectOptions } from "@/interfaces/Utils";
import {
	Label,
	Select as FRSelect,
	SelectProps as FRSelectProps,
} from "flowbite-react";
import React from "react";
import { Control, Controller } from "react-hook-form";



interface SelectProps extends FRSelectProps {
	label?: string;
	name: string;
	options: SelectOptions[];
	control: Control<any>;
	containerClassName?: HTMLDivElement["className"];
}

export default function Select({
	label,
	name,
	options,
	control,
	containerClassName,
	...props
}: SelectProps) {
	return (
		<Controller
			name={name}
			control={control}
			render={({
				field: { onBlur, onChange, ref, value },
				formState,
				fieldState: { error },
			}) => (
				<div className={containerClassName} id="select">
					{label && (
						<div className="mb-1 block">
							<Label
								htmlFor={name}
								color={error ? "failure" : props.color || "gray"}
								value={label}
							/>
						</div>
					)}
					<FRSelect
						color={error ? "failure" : "gray"}
						helperText={error?.message}
						onBlur={onBlur}
						onChange={onChange}
						ref={ref}
						id={name}
						defaultValue={value ? value : ""}
						value={value ? value : ""}
						{...props}
					>
						<option disabled value={""}>
							Selecione uma opção
						</option>
						{options.map(({ label, value }, index) => (
							<option value={value} key={index}>
								{label}
							</option>
						))}
					</FRSelect>
				</div>
			)}
		/>
	);
}
