"use client";

import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { Player } from "@lottiefiles/react-lottie-player";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { suapApi } from "@/services/api";
import { useAuth } from "@/hooks/AuthContext";

interface ISignIn {
	registration: string;
	password: string;
}

export default function SignIn() {
	const signInSchema = yup.object({
		registration: yup.string().required("Campo e-mail é obrigatório"),
		password: yup.string().required("Campo senha é obrigatório"),
	});

	const {
		control,
		handleSubmit,
		setError,
		formState: { isSubmitting },
	} = useForm<ISignIn>({
		resolver: yupResolver(signInSchema),
	});

	const { login } = useAuth();
	const router = useRouter();

	const onSubmit = async (params: ISignIn) => {
		try {
			await login(params.registration, params.password);

			router.push("/visao-geral");
		} catch (err) {
			console.log(err)
			setError("password", { message: "Matrícula ou senha incorreto(s)" });
		}
	};

	return (
		<div className="grid grid-cols-2 ">
			<section className="m-auto">
				<Player
					autoplay
					controls={false}
					loop
					speed={0.5}
					src={"static/lottie-files/login-animation.json"}
					style={{ height: "80%", width: "80%" }}
				/>
				<article className="max-w-xl text-center m-auto mt-4">
					<h1 className="text-black text-lg leading-6">
						<span className="font-bold">Class Planner - </span>Gerenciador de
						horários de aula
					</h1>
					<p className="mt-2 text-gray ">
						A autenticação é feita por meio do SUAP. Por mais que a matrícula
						esteja ativa, apenas o público com permissão poderá acessar o
						sistema, ou seja, apenas para funcionários da COADES/COAPAC e
						professores.
					</p>
				</article>
			</section>
			<section className="w-full bg-background-color flex flex-col h-[100vh] justify-center items-center">
				<form className="max-w-md m-auto p-4" onSubmit={handleSubmit(onSubmit)}>
					<h2 className="text-2xl text-black font-bold">Entre com sua conta</h2>
					<p className="text-base text-gray mb-4">
						Utilize suas credenciais do SUAP para se autenticar
					</p>

					<Input
						name="registration"
						control={control}
						label="Matrícula"
						placeholder="Digite sua matrícula"
						type="text"
					/>
					<Input
						containerClassName="mt-2"
						name="password"
						control={control}
						label="Senha"
						placeholder="Digite sua senha"
						type="password"
					/>

					<Button
						isProcessing={isSubmitting}
						className="w-full mt-6"
						type="submit"
					>
						Entrar
					</Button>
				</form>
			</section>
		</div>
	);
}
