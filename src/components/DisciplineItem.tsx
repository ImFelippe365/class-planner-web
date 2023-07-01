import { BookMarked, GripVertical } from "lucide-react";
import React from "react";

interface DisciplineItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	teacherName: string;
	disciplineName: string;
	editable?: boolean;
	availableQuantity: number;
}

export default function DisciplineItem({
	teacherName,
	disciplineName,
	editable = false,
	availableQuantity,
	...props
}: DisciplineItemProps) {
	const formattedDisciplineName = disciplineName
		.replace(disciplineName.split("-")[0], "")
		.slice(2)
		.split("(")[0];

	return (
		<div
			{...props}
			className={`flex flex-row items-center justify-between ${
				availableQuantity === 0 && "grayscale"
			} ${editable && "cursor-move fc-event"}`}
		>
			<div className="flex flex-row items-center gap-4">
				<div className="p-4 bg-primary-background rounded-lg">
					{editable ? (
						<span className="block w-[32px] h-[32px] text-2xl text-center text-primary font-bold">
							{availableQuantity}
						</span>
					) : (
						<BookMarked size={32} className="text-primary " />
					)}
				</div>
				<div>
					<span className="block text-gray text-xs font-normal">
						{teacherName}
					</span>
					<span className="block text-black font-semibold leading-tight">
						{formattedDisciplineName}
					</span>
				</div>
			</div>
			{editable && <GripVertical size={24} className="text-light-gray" />}
		</div>
	);
}
