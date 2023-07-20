"use client";

import React from "react";
import {
	BreadcrumbComponentProps,
	BreadcrumbItemProps,
	Breadcrumb as FRBreadcrumb,
} from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
	title: string;
	children?: React.ReactNode;
}

export default function Breadcrumb({ title, children }: BreadcrumbProps) {
	const pathname = usePathname();
	const paths = pathname.split("/").slice(1);

	const router = useRouter();

	const onNavigateToLink = (index: number) => {
		const [page] = pathname.split(paths[index + 1]);
		console.log(page);

		router.push(page);
	};

	return (
		<header>
			<section className="flex flex-row justify-between mb-8">
				<h1 className="text-3xl text-black font-bold">{title}</h1>
				{children}
			</section>
			{/* <div className="flex flex-row items-center gap-2 mt-2">
				{paths.map((name, index) => (
					<button
						className={`flex flex-row items-start gap-2 leading-4 ${
							paths.at(-1) !== name
								? "font-bold text-black hover:underline"
								: "font-normal text-gray"
						}`}
						onClick={() => onNavigateToLink(index)}
						disabled={paths.at(-1) == name}
						key={index}
					>
						<div>{name.charAt(0).toUpperCase() + name.slice(1)}</div>
						{index !== paths.length - 1 && (
							<ChevronRight size={18} className="text-gray" />
						)}
					</button>
				))}
			</div> */}
		</header>
	);
}
