import React, { useEffect } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { weekdays } from "@/utils/dates";
import { Teacher } from "@/interfaces/Teacher";
import { Schedule } from "@/interfaces/Course";
import Table from "./Table";
import {
	afternoonStartTimes,
	morningStartTimes,
	nightStartTimes,
} from "@/utils/schedules";
import { formatDisciplineName } from "@/utils/formatDisciplineName";

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

interface TeacherSchedules {
	key?: Array<Schedule>;
}

interface ExportTeacherSchedulesProps {
	teacher?: Teacher;
	teacherSchedules?: Schedule[];
	schedulesByTime?: any;
}

export default function ExportTeacherWeekSchedulesPDF({
	teacher,
	teacherSchedules,
	schedulesByTime,
}: ExportTeacherSchedulesProps) {
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
			color: "white",
		},

		cellHeaderContent: {
			fontWeight: "bold",
			color: "#3d3d3d",
		},

		cellCard: {
			backgroundColor: "#007EA7",
			borderRadius: 2,
			padding: 4,
			width: "100%",
		},

		code: {
			fontSize: 8,
			fontWeight: "light",
			textAlign: "left",
		},

		name: {
			fontSize: 10,
			marginTop: 2,
			fontWeight: "bold",
			textAlign: "left",
		},

		disciplineClass: {
			fontSize: 8,
			marginTop: 8,
			textAlign: "left",
		},

		shiftTitle: {
			fontSize: 14,
			fontWeight: "bold",
			textAlign: "center",
			width: "100%",
			color: "#3d3d3d",
			marginTop: 12,
		},
	});

	const morningTimes = morningStartTimes.map((time) => {
		let row = [time];

		weekdays.forEach((element, index) => {
			teacherSchedules?.forEach((schedule) => {
				const start = `${schedule.start_time.slice(
					0,
					5
				)} - ${schedule.end_time.slice(0, 5)}`;

				if (schedule.weekday === index && start === time) {
					row.push(
						<View style={styles.cellCard}>
							<Text style={[styles.cellContent, styles.code]}>
								{schedule?.discipline?.code}
							</Text>
							<Text style={[styles.cellContent, styles.name]}>
								{formatDisciplineName(schedule?.discipline?.name)}
							</Text>
							<Text style={[styles.cellContent, styles.disciplineClass]}>
								{`${schedule?.schedule_class?.course?.byname} ${
									schedule?.schedule_class?.reference_period
								}° ${
									schedule?.schedule_class?.course?.degree === "Ensino superior"
										? "período"
										: "ano"
								}`}
							</Text>
						</View>
					);
				}
			});
		});

		if (row.length < 6) {
			for (let index = row.length; index < 6; index++) {
				row.push("-");
			}
		}

		return row;
	});
	const afternoonTimes = afternoonStartTimes.map((time) => {
		let row = [time];

		for (let index = 0; index < 5; index++) {
			teacherSchedules?.forEach((schedule) => {
				const start = `${schedule.start_time.slice(
					0,
					5
				)} - ${schedule.end_time.slice(0, 5)}`;

				if (schedule.weekday === index && start === time) {
					row.push(
						<View style={styles.cellCard}>
							<Text style={[styles.cellContent, styles.code]}>
								{schedule?.discipline.code}
							</Text>
							<Text style={[styles.cellContent, styles.name]}>
								{formatDisciplineName(schedule?.discipline?.name)}
							</Text>
							<Text style={[styles.cellContent, styles.disciplineClass]}>
								{`${schedule?.schedule_class?.course?.byname} ${
									schedule?.schedule_class?.reference_period
								}° ${
									schedule?.schedule_class?.course?.degree === "Ensino superior"
										? "período"
										: "ano"
								}`}
							</Text>
						</View>
					);
				}

				if (row.length <= index) {
					row.push("-");
				}
			});
		}

		if (row.length < 6) {
			for (let index = row.length; index < 6; index++) {
				row.push("-");
			}
		}

		return row;
	});

	const nightTimes = nightStartTimes.map((time) => {
		let row = [time];

		weekdays.forEach((element, index) => {
			teacherSchedules?.forEach((schedule) => {
				const start = `${schedule.start_time.slice(
					0,
					5
				)} - ${schedule.end_time.slice(0, 5)}`;

				if (schedule.weekday === index && start === time) {
					row.push(
						<View style={styles.cellCard}>
							<Text style={[styles.cellContent, styles.code]}>
								{schedule?.discipline?.code}
							</Text>
							<Text style={[styles.cellContent, styles.name]}>
								{formatDisciplineName(schedule?.discipline?.name)}
							</Text>
							<Text style={[styles.cellContent, styles.disciplineClass]}>
								{`${schedule?.schedule_class?.course?.byname} ${
									schedule?.schedule_class?.reference_period
								}° ${
									schedule?.schedule_class?.course?.degree === "Ensino superior"
										? "período"
										: "ano"
								}`}
							</Text>
						</View>
					);
				}
			});
		});

		if (row.length < 6) {
			for (let index = row.length; index < 6; index++) {
				row.push("-");
			}
		}

		return row;
	});

	const colSizes = ["14%", "18%", "18%", "18%", "18%", "18%"];

	return (
		<Document>
			<Page
				size="A4"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					marginTop: 16,
				}}
			>
				<View>
					<Text
						style={tw("text-center mx-auto font-bold text-xl text-primary")}
					>
						Horários de aula - {teacher?.name}
					</Text>
				</View>

				<View>
					<Text style={styles.shiftTitle}>Manhã</Text>
					<Table
						th
						col={colSizes}
						children={[["", ...weekdays], ...morningTimes]}
					/>
				</View>
				<View>
					<Text style={styles.shiftTitle}>Tarde</Text>
					<Table
						th
						col={colSizes}
						children={[["", ...weekdays], ...afternoonTimes]}
					/>
				</View>
				<View>
					<Text style={styles.shiftTitle}>Noite</Text>
					<Table
						th
						col={colSizes}
						children={[["", ...weekdays], ...nightTimes]}
					/>
				</View>
			</Page>
		</Document>
	);
}
