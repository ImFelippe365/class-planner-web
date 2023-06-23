import React, { InputHTMLAttributes } from "react";
import {
	CustomFlowbiteTheme,
	FlowbiteTheme,
	Label,
	LabelProps,
	TextInput,
	TextInputProps,
	useTheme,
} from "flowbite-react";
import { Controller, Control } from "react-hook-form";

interface InputProps extends TextInputProps {
	label?: string;
	name: string;
	control: Control<any>;
	containerClassName?: HTMLDivElement["className"];
}

export default function Input({
	label,
	name,
	control,
	containerClassName,
	...props
}: InputProps) {
	return (
		<div className={containerClassName}>
			<Controller
				name={name}
				control={control}
				render={({
					field: { onBlur, onChange, ref },
					formState,
					fieldState: { error },
				}) => (
					<>
						{label && (
							<div className="mb-1 block">
								<Label
									color={error ? "failure" : props.color || "gray"}
									htmlFor={props.id}
									value={label}
								/>
							</div>
						)}
						<TextInput
							color={error ? "failure" : "gray"}
							helperText={error?.message}
							name={name}
							onBlur={onBlur}
							onChange={onChange}
							ref={ref}
							{...props}
						/>
					</>
				)}
			/>
		</div>
	);
}
