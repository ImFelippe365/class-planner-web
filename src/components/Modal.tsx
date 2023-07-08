import React from "react";
import { Modal as FRModal, ModalProps as FRModalProps } from "flowbite-react";

interface CustomModalProps extends FRModalProps {
	title: string;
	description?: string;
	body?: React.ReactNode;
	footer?: React.ReactNode;
	openModal: boolean;
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Modal({
	openModal,
	setOpenModal,
	title,
	description,
	body,
	footer,
	...props
}: CustomModalProps) {
	return (
		<FRModal
			show={openModal}
			size="4xl"
			theme={{
				content: {
					inner:
						"relative bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh] rounded-2xl",
				},
			}}
			popup
			className="bg-black"
			onClose={() => setOpenModal(false)}
			{...props}
		>
			<FRModal.Header className="!pt-9 !px-9">
				<h3 className="text-xl text-black font-bold">{title}</h3>
				{description && (
					<p className="text-sm text-gray font-normal">{description}</p>
				)}
			</FRModal.Header>
			<FRModal.Body className="!px-9">{body}</FRModal.Body>
			<FRModal.Footer>{footer}</FRModal.Footer>
		</FRModal>
	);
}
