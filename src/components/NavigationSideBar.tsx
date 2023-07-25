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
	const { user, logout, hasEmployeePermissions, hasTeacherPermissions } =
		useAuth();
	const NavigationItemStyles =
		"w-full py-4 px-6 flex items-center gap-4 justify-start rounded-lg font-semibold hover:bg-primary-background transition-all";
	const pathname = usePathname();
	const [_, path] = pathname.split("/");

	const routes = [
		{
			name: "Visão Geral",
			icon: <Layers />,
			path: "visao-geral",
			permission: true
		},
		{
			name: "Cursos",
			icon: <GraduationCap />,
			path: "cursos",
			permission: true
		},
		{
			name: "Professores",
			icon: <Briefcase />,
			path: "professores",
			permission: true
		},
		{
			name: "Estudantes",
			icon: <User />,
			path: "estudantes",
			permission: true
		},
		{
			name: "Turmas",
			icon: <Users />,
			path: "turmas",
			permission: true
		},
		{
			name: "Alertas",
			icon: <Bell />,
			path: "alertas",
			permission: hasEmployeePermissions,
		},
		{
			name: "Substituir professores",
			icon: <Replace />,
			path: "pedidos-para-substituicao",
			permission: hasTeacherPermissions,
		},
	];

	return (
		<aside className="h-[100vh] bg-white max-h-[100vh] w-[280px]">
			<section className="fixed flex flex-col items-center gap-8 h-[100vh] bg-white max-h-[100vh] w-[280px] py-8 px-4">
				<h1 className="text-black text-2xl text-center font-bold">
					Class Planner
				</h1>

				{hasTeacherPermissions ? (
					<Link href={`professores/${user?.id}`} className="flex flex-row flex-shrink-0 flex-grow-0 justify-start items-center gap-4 px-4 w-full hover:bg-primary-dark-transparent transition-all rounded-2xl py-2">
						
							{user?.avatar ? (
								<div className="relative w-12 h-12">
									<Image
										alt={user.name}
										src={`https://suap.ifrn.edu.br${user.avatar}`}
										fill
										className="object-cover rounded-full"
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
					</Link>
				) : (
					<header className="flex flex-row flex-shrink-0 flex-grow-0 justify-start items-center gap-4 px-4 w-full">
						{user?.avatar ? (
							<div className="relative w-12 h-12">
								<Image
									alt={user.name}
									src={`https://suap.ifrn.edu.br${user.avatar}`}
									fill
									className="object-cover rounded-full"
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
				)}

				<nav className="flex flex-col items-center justify-start w-full text-primary-dark text-base gap-2">
					{routes.map((route, index) => {
						if (!route?.permission) return;
						return (
							<Link
								key={index.toString()}
								href={route.path}
								className={`${NavigationItemStyles} ${path === route.path && "bg-primary-background text-primary"
									}`}
							>
								{route.icon}
								<p>{route.name}</p>
							</Link>
						);
					})}
					<button
						onClick={() => logout()}
						className={`${NavigationItemStyles} text-error mt-4 hover:bg-error-transparent`}
					>
						<LogOut />
						<p>Sair</p>
					</button>
				</nav>
			</section>
		</aside>
	);
}
