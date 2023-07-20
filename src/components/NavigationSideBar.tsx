import { useAuth } from "@/hooks/AuthContext";
import { Sidebar } from "flowbite-react";
import {
	Layers,
	GraduationCap,
	Briefcase,
	LogOut,
	User,
	Users,
	Bell,
	Replace,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavigationSideBar(): React.ReactNode {
	const { user } = useAuth();
	const NavigationItemStyles =
		"w-full py-4 px-6 flex items-center gap-4 justify-start rounded-lg font-semibold hover:bg-primary-background transition-all";
	const pathname = usePathname();
	const [_, path] = pathname.split("/");

	const routes = [
		{
			name: "Visão Geral",
			icon: <Layers />,
			path: "visao-geral",
		},
		{
			name: "Cursos",
			icon: <GraduationCap />,
			path: "cursos",
		},
		{
			name: "Professores",
			icon: <Briefcase />,
			path: "professores",
		},
		{
			name: "Estudantes",
			icon: <User />,
			path: "estudantes",
		},
		{
			name: "Turmas",
			icon: <Users />,
			path: "turmas",
		},

		{
			name: "Notificações",
			icon: <Bell />,
			path: "alertas",
		},
		{
			name: "Substituir professores",
			icon: <Replace />,
			path: "pedidos-para-substituicao",
		},
	];

	return (
		<aside className="h-[100vh] bg-white max-h-[100vh] w-[280px]">
			<section className="fixed flex flex-col items-center gap-8 h-[100vh] bg-white max-h-[100vh] w-[280px] py-8 px-4">
				<h1 className="text-black text-2xl text-center font-bold">
					Class Planner
				</h1>
				<header className="flex flex-row flex-shrink-0 flex-grow-0 justify-start items-center gap-4 px-4 w-full">
					{user?.avatar ? (
						<div className="w-12 h-12 aspect-square object-cover">
							<Image
								alt={user.name}
								src={`https://suap.ifrn.edu.br${user.avatar}`}
								fill
								className="max-w-12 max-h-12 object-cover rounded-full"
							/>
						</div>
					) : (
						<User
							fontSize={48}
							className="text-primary bg-primary-background rounded-full p-3 w-12 h-12"
						/>
					)}
					<div>
						<h3 className="font-semibold text-black text-sm leading-tight">
							{user?.name}
						</h3>
						<p className="text-gray text-xs">{user?.department}</p>
					</div>
				</header>

				<nav className="flex flex-col items-center justify-start w-full text-primary-dark text-base gap-2">
					{routes.map((route, index) => (
						<Link
							key={index.toString()}
							href={route.path}
							className={`${NavigationItemStyles} ${
								path === route.path && "bg-primary-background text-primary"
							}`}
						>
							{route.icon}
							<p>{route.name}</p>
						</Link>
					))}
					<Link
						href={"#"}
						className={`${NavigationItemStyles} text-error mt-4 hover:bg-error-transparent`}
					>
						<LogOut />
						<p>Sair</p>
					</Link>
				</nav>
			</section>
		</aside>
	);
}
