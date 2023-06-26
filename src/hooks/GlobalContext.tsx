import { Class, Course } from "@/interfaces/Course";
import { CreateTeacher } from "@/interfaces/Teacher";
import { api, suapApi } from "@/services/api";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface GlobalProviderProps {
	children: React.ReactNode;
}

interface GlobalContextValues {
	courses: Course[];
	setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
	classes: Class[];
	setClasses: React.Dispatch<React.SetStateAction<Class[]>>;

	getAllCourses: () => Promise<void>;
	getAllClasses: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextValues>(
	{} as GlobalContextValues
);

const GlobalProvider = ({ children }: GlobalProviderProps) => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [classes, setClasses] = useState<Class[]>([]);

	const getAllCourses = useCallback(async () => {
		const { data } = await api.get("courses/");

		setCourses(data);
	}, []);

	const getAllClasses = useCallback(async () => {
		const { data } = await api.get("classes/");

		setClasses(data);
	}, []);

	useEffect(() => {
		getAllCourses();
		getAllClasses();
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				courses,
				setCourses,
				classes,
				setClasses,

				getAllCourses,
				getAllClasses,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

const useGlobal = () => {
	const context = useContext(GlobalContext);

	return context;
};

export { useGlobal, GlobalProvider };
