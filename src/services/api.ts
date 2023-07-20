import axios from "axios";

export const api = axios.create({
	baseURL: "http://localhost:8000/api/",
});

export const suapApi = axios.create({
	baseURL: "https://suap.ifrn.edu.br/api/v2/",
});

suapApi.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem("@ClassPlanner:token");
		const refresh = localStorage.getItem("@ClassPlanner:refresh");
		
		if (token) config.headers.Authorization = `Bearer ${token}`;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,

	(error) => Promise.reject(error || "Something went wrong")
);
