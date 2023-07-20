export const formatDisciplineName = (disciplineName: string) =>
	disciplineName
		.replace(disciplineName.split("-")[0], "")
		.slice(2)
		.split("(")[0];
