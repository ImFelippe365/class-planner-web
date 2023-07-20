"use client"

import React, { useState } from "react";
import { api } from "@/services/api";
import { Modal } from 'flowbite-react';
import Button from "./Button";
import { Trash } from "lucide-react";

interface DeleteModalProps {
	type: "discipline" | "course" | "teacherDiscipline";
	children: React.ReactNode;
}

export default function DeleteModal({ type, children }: DeleteModalProps): React.ReactNode {
	const [openModal, setOpenModal] = useState<string | undefined>();

	return (
		<>
			<button
				className="flex flex-row w-full hover:bg-error-transparent rounded-lg cursor-pointer gap-3 items-center p-2"
				onClick={() => setOpenModal('pop-up')}>
				<Trash width={16} height={16} color="#C92A2A" />
				<p className="font-semibold text-xs text-error">Remover</p>
			</button>

			<Modal 
				show={openModal === 'pop-up'} size="md" popup 
				onClose={() => setOpenModal(undefined)}
				className="backdrop-opacity-25 backdrop-contrast-50">
				<Modal.Header />
				<Modal.Body>
					<div className="text-rigth text-primary-dark">
						<h3 className="mb-4 text-lg font-semibold">
							Tem certeza?
						</h3>
						<p className="mb-3">Ao excluir {type === "course" ? "um curso" : "o vínculo de uma disciplina"}, essa ação <span className="font-semibold">não podera ser desfeita</span></p>
						<div className="flex justify-end gap-4">
							<Button color="failure" className="bg-error" onClick={() => setOpenModal(undefined)}>
								Cancelar
							</Button>
							{children}
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
}