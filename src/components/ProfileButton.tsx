import React from "react";

interface ProfileButtonProps {
	children: React.ReactNode;
	containerOnClick: () => void;
}

export default function ProfileButton({ children, containerOnClick }: ProfileButtonProps): React.ReactNode {
	return (
		<button className="flex items-center justify-start bg-white px-3 py-2 gap-x-2 rounded-lg shadow w-full outline-none" onClick={containerOnClick}>
			{children}
		</button>
	)
}