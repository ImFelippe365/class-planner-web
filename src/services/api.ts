import axios from "axios";

export const api = axios.create({
	baseURL: 'http://localhost:8000/api/'
})

export const suapApi = axios.create({
	baseURL: "https://suap.ifrn.edu.br/api/v2/",
});

// suapApi.interceptors.request.use(
// 	async (config) => {
// 		const [token, refresh] = await localStorage.multiGet([
// 			'@ClassPlanner:token',
// 			'@ClassPlanner:refresh',
// 		]);

// 		if (token[1]) config.headers.Authorization = `Bearer ${token[1]}`;

// 		return config;
// 	}, (error) => {
// 		return Promise.reject(error);
// 	});

// api.interceptors.response.use(

// 	(response) => response,

// 	(error) => Promise.reject((error) || 'Something went wrong')

// );
