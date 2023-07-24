export const formatDisciplineName = (disciplineName: string) => {
	if (!disciplineName.includes("-")) return disciplineName;
	return disciplineName
		.replace(disciplineName.split("-", 1)[0], "")
		.slice(2)
		.split("(")[0];
};
