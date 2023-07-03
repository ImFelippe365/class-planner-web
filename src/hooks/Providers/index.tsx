import React from "react";
import { AuthProvider } from "../AuthContext";
import { GlobalProvider } from "../GlobalContext";
import { ScheduleProvider } from "../ScheduleContext";

interface ProviderProps {
	children: React.ReactNode;
}

export default function Provider({ children }: ProviderProps) {
	return (
		<AuthProvider>
			<GlobalProvider>
				<ScheduleProvider>{children}</ScheduleProvider>
			</GlobalProvider>
		</AuthProvider>
	);
}
