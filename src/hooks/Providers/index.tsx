import React from "react";
import { AuthProvider } from "../AuthContext";
import { GlobalProvider } from "../GlobalContext";

interface ProviderProps {
	children: React.ReactNode;
}

export default function Provider({ children }: ProviderProps) {
	return (
		<AuthProvider>
			<GlobalProvider>{children}</GlobalProvider>
		</AuthProvider>
	);
}
