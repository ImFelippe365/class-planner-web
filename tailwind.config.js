/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/flowbite-react/**/*.js",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				primary: "#007EA7",
				"primary-dark": "#000E1A",
				"primary-dark-transparent": "rgba(0,50,73,0.1)",
				"primary-background": "rgba(0,126,167,0.08)",
				"primary-light": "#F4FBFC",
				"secondary-light": "#9AD1D4",
				"light-gray-hover": "#D9D9D925",
				white: "#FFFFFF",
				"light-gray": "#D9D9D9",
				gray: "#676767",
				black: "#3D3D3D",
				placeholder: "#919EAB",
				"background-color": "#FAFAFA",
				contrast: "#4A9E68",
				shape: "#C1C1C1",
				success: "#58AE30",
				error: "#C92A2A",
				warning: "#E1A917",
				"ultra-violet": "#52489C",
				coffee: "#6D4C3D",
				orange: "#FF8600",
				"ultra-violet-transparent": "rgba(82,72,156,0.1)",
				"coffee-transparent": "rgba(109,76,61,0.1)",
				"orange-transparent": "rgba(255,134,0,0.1)",
				"success-transparent": "rgba(88,174,48,0.1)",
				"error-transparent": "rgba(201, 42, 42, 0.1)",
				"warning-transparent": "rgba(225,169,23,0.1)",
				"background-black-transparent": "rgba(0,0,0,0.6)",
			},
			gridTemplateColumns: {
				container: '330px auto'
			}
		},
	},
	plugins: [
		require('flowbite/plugin')
	]

};
