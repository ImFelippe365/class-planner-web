import React from "react";
import { ButtonProps, Button as FRButton } from "flowbite-react";

interface IButtonProps extends ButtonProps {
	children: React.ReactNode;
}

export default function Button({ children, ...props }: IButtonProps) {
	return <FRButton {...props}>{children}</FRButton>;
}
