export const removeAccents = (text: string) =>
	text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
