import { GripVertical } from "lucide-react";
import React from "react";

interface DraggrableDisciplineProps {
	id: string;
	title: string;
	quantity: number
}

export default function DraggrableDiscipline({
	id,
	title,
	quantity,
}: DraggrableDisciplineProps) {
	return (
		<div
			className="flex flex-row items-center justify-between cursor-move pl-3 pr-4 py-4  rounded-lg fc-event bg-white"
			title={title}
		>
			<div className="flex items-center gap-2">
				<GripVertical size={14} className="text-primary" />
				<span className="font-bold text-primary text-base">{title}</span>
			</div>

			<span className="text-primary text-sm">{quantity}</span>
		</div>
	);
}
