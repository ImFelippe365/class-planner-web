import { Download, Plus } from "lucide-react";
import React from "react";

interface ProfileButtonProps {
	type: "export" | "bind";
	title: string;
	text: string;
}

export default function ProfileButton({ type, title, text }: ProfileButtonProps): React.ReactNode {
	return (
		<button className="flex items-center justify-start bg-white px-3 py-2 gap-x-2 rounded-lg shadow w-full outline-none">
			{type == "export" ? (
				<Download className="text-primary w-14 h-12 p-3 rounded-lg bg-primary-background" />
			) :
				<Plus className="text-primary w-14 h-14 p-3 rounded-lg bg-primary-background" />
			}

			<div className="flex text-start flex-col">
				<p className="text-primary font-semibold text-sm">{title}</p>
				<p className="text-placeholder text-xs">{text}</p>
			</div>
		</button>
	)
}