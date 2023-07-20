"use client";

import { Loader, Loader2 } from "lucide-react";
import SignIn from "./entrar/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		router.replace("/entrar");
	}, []);

	return (
		<div className="w-full h-[100vh] flex items-center justify-center">
			<div className="flex items-center justify-center gap-3">
				<Loader2 className="animate-spin text-primary" size={32} />
				<span className="text-gray font-normal text-base">
					Levando você para a página correta
				</span>
			</div>
		</div>
	);
}
