import React, { InputHTMLAttributes } from "react";
import {
	CustomFlowbiteTheme,
	FlowbiteTheme,
	Label,
	Textarea,
	TextareaProps,
	useTheme,
} from "flowbite-react";
import { Controller, Control } from "react-hook-form";

interface TextAreaProps extends TextareaProps {
	label?: string;
	name: string;
	control: Control<any>;
	containerClassName?: HTMLDivElement["className"];
}

export default function TextArea({
	label,
	name,
	control,
	containerClassName,
	...props
}: TextAreaProps) {
	return (
		<Controller
			name={name}
			control={control}
			render={({
				field: { onBlur, onChange, ref },
				formState,
				fieldState: { error },
			}) => (
				<div className={containerClassName}>
					{label && (
						<div className="mb-1 block">
							<Label
								color={error ? "failure" : props.color || "gray"}
								htmlFor={props.id}
								value={label}
							/>
						</div>
					)}
					<Textarea
						color={error ? "failure" : "gray"}
						helperText={error?.message}
						name={name}
						onBlur={onBlur}
						onChange={onChange}
						ref={ref}
						{...props}
					/>
				</div>
			)}
		/>
	);
}
