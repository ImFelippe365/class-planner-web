import { CreateTeacher, Teacher } from "@/interfaces/Teacher";
import { api, suapApi } from "@/services/api";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface AuthProviderProps {
	children: React.ReactNode;
}

interface AuthContextValues {
	user: Teacher | undefined;
	setUser: React.Dispatch<React.SetStateAction<Teacher | undefined>>;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	getTeacherProfile: (registration: string) => Promise<any>;
	hasTeacherPermissions: boolean;
	hasEmployeePermissions: boolean;
}

const AuthContext = createContext({} as AuthContextValues);

const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<Teacher | undefined>(() => {
		const storagedSession = localStorage.getItem("@ClassPlanner:user");

		const savedUser = storagedSession ? JSON.parse(storagedSession) : null;
		return savedUser;
	});

	const hasTeacherPermissions = user?.department === "Professor";
	const hasEmployeePermissions = user?.department === "Aluno";

	const registerTeacher = useCallback(async (new_teacher: CreateTeacher) => {
		try {
			const { data } = await api.post("teachers/", new_teacher);

			return data;
		} catch (error) {
			console.warn("Erro ao tentar cadastrar estudante ->", error);
		}
	}, []);

	const getTeacherIsRegistered = useCallback(async (registration: string) => {
		try {
			const { data } = await api.get(
				`teachers/byregistration/${registration}/`
			);

			return data;
		} catch (error) {
			console.warn(
				"Erro ao tentar verificar se estudante está registrado ->",
				JSON.stringify(error)
			);
			return false;
		}
	}, []);

	const getTeacherProfile = useCallback(async () => {
		try {
			const { data } = await suapApi.get("minhas-informacoes/meus-dados/");

			// if (data.tipo_vinculo !== "Aluno") {
			// 	console.warn("Apenas estudantes podem se autenticar");
			// 	return;
			// }

			let teacher = await getTeacherIsRegistered(data.matricula);

			if (!teacher) {
				console.log("entrei aqui viu");
				teacher = await registerTeacher({
					registration: data.matricula,
					name: data.nome_usual,
					department: data.tipo_vinculo,
					email: data.email,
					avatar: data.url_foto_75x100,
				});
			}

			setUser(teacher);

			localStorage.setItem("@ClassPlanner:user", JSON.stringify(teacher));
		} catch (error) {
			console.log("Erro ao tentar pegar o perfil do usuário ->", error);
		}
	}, []);

	const login = useCallback(async (username: string, password: string) => {
		try {
			const params = {
				username: username,
				password: password,
			};

			const { data } = await suapApi.post("autenticacao/token/", params);

			localStorage.setItem("@ClassPlanner:token", data.access);
			localStorage.setItem("@ClassPlanner:refresh", data.refresh);

			getTeacherProfile();
		} catch (error) {
			throw new Error("Erro ao tentar fazer login");
			console.log("Erro ao tentar fazer login ->", JSON.stringify(error));
		}
	}, []);

	const logout = useCallback(async () => {
		setUser(undefined);

		localStorage.removeItem("@ClassPlanner:user");
		localStorage.removeItem("@ClassPlanner:token");
		localStorage.removeItem("@ClassPlanner:refresh");
	}, []);

	const loadSavedSession = async () => {
		const storagedSession = localStorage.getItem("@ClassPlanner:user");

		const savedUser = storagedSession ? JSON.parse(storagedSession) : null;
		if (savedUser) setUser(savedUser);
	};

	useEffect(() => {
		loadSavedSession();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				login,
				logout,
				getTeacherProfile,
				hasTeacherPermissions,
				hasEmployeePermissions,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	const context = useContext(AuthContext);

	return context;
};

export { useAuth, AuthProvider };
