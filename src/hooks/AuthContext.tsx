import { CreateTeacher } from "@/interfaces/Teacher";
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

const AuthContext = createContext({});

const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState();

	const registerTeacher = useCallback(async (new_teacher: CreateTeacher) => {
		try {
			const { data } = await api.post("teachers/", new_teacher);

			return data[0];
		} catch (error) {
			console.warn("Erro ao tentar cadastrar estudante ->", error);
		}
	}, []);

	const getTeacherIsRegistered = useCallback(async (registration: string) => {
		try {
			const { data } = await api.get(
				`students/byregistration/${registration}/`
			);

			if (data?.details == "Não encontrado") return false;

			return data;
		} catch (error) {
			console.warn(
				"Erro ao tentar verificar se estudante está registrado ->",
				JSON.stringify(error)
			);
		}
	}, []);

	const getTeacherProfile = useCallback(async () => {
		try {
			const { data } = await suapApi.get("minhas-informacoes/meus-dados/");
			console.log(data.tipo_vinculo)
			if (data.tipo_vinculo !== "Aluno") {
				console.warn("Apenas estudantes podem se autenticar");
				return;
			}

			let teacher = await getTeacherIsRegistered(data.vinculo.matricula);

			if (!teacher) {
				teacher = await registerTeacher({
					registration: "3000",
					name: "João Pedro",
					department: "Professor",
				});
			}

			setUser(data);

			localStorage.setItem("@ClassPlanner:user", JSON.stringify(data));
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

		const user = storagedSession ? JSON.parse(storagedSession) : null;

		if (user) setUser(user);
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
				getTeacherProfile
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
