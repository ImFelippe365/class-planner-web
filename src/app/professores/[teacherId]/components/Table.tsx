import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const styles = StyleSheet.create({
	em: {
		fontStyle: "bold",
	},
	table: {
		paddingHorizontal: 18,
		width: "100%",
		display: "flex",
		flexDirection: "column",
		marginVertical: 12,
	},
	tableRow: {
		display: "flex",
		flexDirection: "row",
	},

	cell: {
		borderWidth: 1,
		borderColor: "#676767",
		display: "flex",
		justifyContent: "center",
		alignContent: "center",
		textAlign: "center",
		flexWrap: "wrap",
	},

	cellContent: {
		fontWeight: "normal",
		fontSize: 12,
		color: "#676767",
	},

	cellHeaderContent: {
		fontWeight: "bold",
		color: "#3d3d3d",
	},
});

const tw = createTw({
	theme: {
		extend: {
			colors: {
				primary: "#007EA7",
				gray: "#676767",
				black: "#3D3D3D",
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
		},
	},
});

const Table = ({ children, col, th }: any) => (
	<View style={[styles.table, tw("table")]}>
		{children.map((row, ind) => (
			<View
				key={ind}
				style={[styles.tableRow, th && ind === 0 ? styles.em : {}]}
			>
				{row.map((cell, j) => (
					<View
						key={j}
						style={[
							styles.cell,
							{
								width: col[j],
								// height: 60,
								paddingLeft: 2,
								paddingVertical: 2,
								justifyContent: "flex-start",
							},
						]}
					>
						{typeof cell === "string" || typeof cell === "number" ? (
							<Text
								style={[
									styles.cellContent,
									styles.cellHeaderContent,
									tw("border-collapse"),
								]}
							>
								{cell}
							</Text>
						) : (
							cell
						)}
					</View>
				))}
			</View>
		))}
	</View>
);

export default Table;
