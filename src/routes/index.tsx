import NavigationSideBar from "@/components/NavigationSideBar";
import { useAuth } from "@/hooks/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface RoutesProps {
	children: React.ReactNode;
}

export default function Routes({ children }: RoutesProps) {
	const router = useRouter();
	const pathname = usePathname();

	const { user } = useAuth();

	document.title = "Class Planner";

	useEffect(() => {
		if (user && pathname === "/entrar") router.replace("/visao-geral");
		if (!user && pathname !== "/entrar") router.replace("/entrar");
	}, [user]);

	if (pathname === "/entrar" || pathname === "/") return children;
	return (
		<main className="grid grid-cols-container bg-background-color">
			<NavigationSideBar />
			<div
				style={{
					maxWidth: "90%",
					width: "100%",
					padding: "24px 36px 0px",
					margin: "64px auto 0px",
				}}
				className="mx-auto px-9 pt-6"
			>
				{children}
			</div>
		</main>
	);
}
