"use client";

import React, { useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";

interface CancelScheduleFormModalProps {
	openModal: boolean;
	setOpenModal: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function CancelScheduleFormModal({
	openModal,
	setOpenModal,
}: CancelScheduleFormModalProps) {

	return (
		<>
			<Button onClick={() => setOpenModal("form-elements")}>
				Toggle modal
			</Button>
			<Modal
				show={openModal}
				size="md"
				popup
				onClose={() => setOpenModal(undefined)}
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6">
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">
							Cancelar aula
						</h3>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="email" value="Your email" />
							</div>
							<TextInput id="email" placeholder="name@company.com" required />
						</div>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="password" value="Your password" />
							</div>
							<TextInput id="password" type="password" required />
						</div>
						<div className="flex justify-between">
							<div className="flex items-center gap-2">
								<Checkbox id="remember" />
								<Label htmlFor="remember">Remember me</Label>
							</div>
							<a
								href="/modal"
								className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
							>
								Lost Password?
							</a>
						</div>
						<div className="w-full">
							<Button>Log in to your account</Button>
						</div>
						<div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
							Not registered?&nbsp;
							<a
								href="/modal"
								className="text-cyan-700 hover:underline dark:text-cyan-500"
							>
								Create account
							</a>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
