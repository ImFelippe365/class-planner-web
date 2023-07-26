import { Schedule } from "@/interfaces/Course";
import { Teacher } from "@/interfaces/Teacher"
import { formatDisciplineName } from "@/utils/formatDisciplineName";
import { formatDate } from "@fullcalendar/core";
import { View, Page, Text, StyleSheet, Document } from "@react-pdf/renderer"
import { data } from "autoprefixer";
import { createTw } from "react-pdf-tailwind";

interface ExportTeacherReportProps {
	teacher?: Teacher;
	teacherMonthSchedules: Schedule[];
	currentDate: Date;
}

const tw = createTw({
	theme: {
		extend: {
			colors: {
				primary: "#007EA7",
				gray: "#676767",
				black: "#3D3D3D",
				contrast: "#4A9E68",
				canceled: "#C92A2A",
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
		},
	},
});


export default function ExportTeacherReport({
	teacher,
	teacherMonthSchedules,
	currentDate
}: ExportTeacherReportProps) {

	const styles = StyleSheet.create({
		classContent: {
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			columnGap: 12,
		},
		classesTaught: {
			width: 123,
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			fontSize: 12,
			color: "#FFFFFF",
			backgroundColor: "#4A9E68",
			padding: 8,
			marginTop: 12,
		},
		futureClasses: {
			width: 123,
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			fontSize: 12,
			color: "#FFFFFF",
			backgroundColor: "#007EA7",
			padding: 8,
			marginTop: 12,
		},
		canceledClasses: {
			width: 123,
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			fontSize: 12,
			color: "#FFFFFF",
			backgroundColor: "#C92A2A",
			padding: 8,
			marginTop: 12,
		},
		substituteClasses: {
			width: 123,
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			fontSize: 12,
			color: "#FFFFFF",
			backgroundColor: "#FF8600",
			padding: 8,
			marginTop: 12,
		},
		classDate: {
			fontSize: 10,
		}
	})

	teacherMonthSchedules.sort((scheduele1, scheduele2) => {
		const date1 = new Date(`${scheduele1.class_date} ${scheduele1.start_time}`);
		const date2 = new Date(`${scheduele2.class_date} ${scheduele2.start_time}`);
		return date1 - date2;
	});

	const futureClasses = teacherMonthSchedules.filter((schedule) => {
		return (new Date(`${schedule.class_date} ${schedule.start_time}`) > currentDate) && !schedule.canceled_class
	})

	const canceledClasses = teacherMonthSchedules.filter((schedule) => {
		return schedule.canceled_class
	})

	const substituteClasses = teacherMonthSchedules.filter((schedule) => {
		return schedule.class_to_replace
	})

	const classesTaught = teacherMonthSchedules.filter((schedule) => {
		return (new Date(`${schedule.class_date} ${schedule.start_time}`) < currentDate) && !schedule.canceled_class
	})

	const filteredDisciplines = teacherMonthSchedules.reduce((accumulator: any, schedule) => {

		let className = schedule.schedule_class.course.byname + schedule.schedule_class.shift[0] + schedule.schedule_class.reference_period
		let disciplineName = formatDisciplineName(schedule.discipline.name)

		if (className in accumulator && !(accumulator[className][disciplineName])) {
			return { ...accumulator, [className]: { ...accumulator[className], [disciplineName]: [schedule] } }
		} else if (className in accumulator && accumulator[className][disciplineName]) {
			return { ...accumulator, [className]: { ...accumulator[className], [disciplineName]: [schedule, ...accumulator[className][disciplineName]] } }
		} else {
			return { ...accumulator, [className]: { [disciplineName]: [schedule] } }
		}
	}, {})

	console.log(filteredDisciplines)

	/* quantityClassDisciplines = Object.entries(filteredDisciplines).map(([className, disciplineName]) => {
		Object.entries(disciplineName).map(([disciplineKey, scheduleArray]) => {
			scheduleArray.map((schedule) => {
				console.log(schedule)
				return schedule
			})
		})
	} */


	return (
		<Document>
			<Page
				size="A4"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					marginTop: 16,
					marginBottom: 16,
					paddingBottom: 16,
				}}
			>
				<View style={tw("w-[90%] pb-3 flex flex-col")} >
					<View style={tw("text-center font-bold text-xl")}>
						<Text>
							Relatório mensal
						</Text>
					</View>

					<View style={tw("flex flex-col justify-start text-xl border-b-2")}>
						<Text>Nome: {teacher?.name}</Text>
						<Text>Matrícula: {teacher?.registration}</Text>
						<Text>E-mail: {teacher?.email}</Text>
					</View>

					<View style={tw("mt-4")}>
						<Text style={tw("text-xl h-10")}>Aulas ministradas</Text>
						<View style={styles.classContent} >
							{classesTaught.map((schedule) => (
								<View style={styles.classesTaught}>
									<Text style={styles.classDate}>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text style={styles.classDate}>
										{schedule.start_time} - {schedule.end_time}:
									</Text>
									<Text style={tw("mt-3")}>{formatDisciplineName(schedule.discipline.name)}</Text>
									<Text>Quantidade: {schedule.quantity}</Text>
									<Text>{schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}</Text>
								</View>
							))}
						</View>
					</View>

					<View style={tw("mt-4")}>
						<Text style={tw("text-xl h-10")}>Aulas futuras</Text>
						<View style={styles.classContent} >
							{futureClasses.map((schedule) => (
								<View style={styles.futureClasses}>
									<Text style={styles.classDate}>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text style={styles.classDate}>
										{schedule.start_time} - {schedule.end_time}:
									</Text>
									<Text style={tw("mt-3")}>{formatDisciplineName(schedule.discipline.name)}</Text>
									<Text>Quantidade: {schedule.quantity}</Text>
									<Text>{schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}</Text>
								</View>
							))}
						</View>
					</View>

					<View style={tw("mt-4")}>
						<Text style={tw("text-xl h-10")}>Aulas canceladas</Text>
						<View style={styles.classContent} >
							{canceledClasses.map((schedule) => (
								<View style={styles.canceledClasses}>
									<Text style={styles.classDate}>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text style={styles.classDate}>
										{schedule.start_time} - {schedule.end_time}:
									</Text>
									<Text style={tw("mt-3")}>{formatDisciplineName(schedule.discipline.name)}</Text>
									<Text>Quantidade: {schedule.quantity}</Text>
									<Text>{schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}</Text>
								</View>
							))}
						</View>
					</View>

					<View style={tw("mt-4")}>
						<Text style={tw("text-xl h-10")}>Aulas que foram substituídas</Text>
						<View style={styles.classContent} >
							{substituteClasses.map((schedule) => (
								<View style={styles.substituteClasses}>
									<Text>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text style={styles.classDate}>
										{schedule.start_time} - {schedule.end_time}:
									</Text>
									<Text style={tw("mt-3")}>{formatDisciplineName(schedule.discipline.name)}</Text>
									<Text>Quantidade: {schedule.quantity}</Text>
									<Text>{schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}</Text>
									<Text style={tw("mt-3")}>Substituída por {schedule.class_to_replace.teacher.name}</Text>
								</View>
							))}
						</View>
					</View>


					{/* <View style={tw("mt-4")}>
						<Text style={tw("text-xl")}>Disciplinas por turma</Text>
						<View style={tw("text-xl")} >


							{Object.entries(filteredDisciplines).map(([className, disciplineName]) => (
								<View>
									<Text>{className}</Text>
									{Object.entries(disciplineName).map(([disciplineKey, scheduleArray]) => (
										<>
											<Text>{disciplineKey}</Text>
											{scheduleArray.map((schedule: Schedule) => (
												<>
													{schedule.class_date in classesTaught && (
														<Text>{schedule.quantity}</Text>
													)}
												</>
											))}
										</>
									))}

								</View>
							))}

						</View>
					</View> */}

				</View>
			</Page>
		</Document>

	)
}