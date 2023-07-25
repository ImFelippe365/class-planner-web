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
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
		},
	},
});

const styles = StyleSheet.create({

})

export default function ExportTeacherReport({
	teacher,
	teacherMonthSchedules,
	currentDate
}: ExportTeacherReportProps) {

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

	interface ArrayObjects {
		key?: Array<Schedule>;
	}

	let schedulesByClass = {};

	/* const filterDisciplines = teacherMonthSchedules.map((schedule) => {

		let classSchedules = []
		let className = schedule.schedule_class.course.byname + schedule.schedule_class.shift[0] + schedule.schedule_class.reference_period
		let disciplineName = formatDisciplineName(schedule.discipline.name)

		const currentClass = []
		if (className in schedulesByClass && !(schedulesByClass[className][disciplineName])) {

			classSchedules.push({ [disciplineName]: [schedule] })
			schedulesByClass[className] = [...classSchedules]
		} else if (className in schedulesByClass && schedulesByClass[className][disciplineName]) {

			classSchedules.push({ [disciplineName]: [...schedulesByClass[className][disciplineName], schedule] })
			schedulesByClass[className] = [...classSchedules]
		} else {

			schedulesByClass = { [className]: { [disciplineName]: [schedule] } }
		}


		return schedulesByClass
	}) */
	//console.log(filterDisciplines)

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
						<View style={tw("text-xl")} >
							{classesTaught.map((schedule) => (
								<>
									<Text>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text>
										{schedule.start_time} - {schedule.end_time}: {formatDisciplineName(schedule.discipline.name)} - {schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}
									</Text>
								</>
							))}
						</View>
					</View>

					<View style={tw("mt-4")}>
						<Text style={tw("text-xl h-10")}>Aulas futuras</Text>
						<View style={tw("text-xl")} >
							{futureClasses.map((schedule) => (
								<>
									<Text>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text>
										{schedule.start_time} - {schedule.end_time}: {formatDisciplineName(schedule.discipline.name)} - {schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}
									</Text>
								</>
							))}
						</View>
					</View>

					<View style={tw("mt-4")}>
						<Text style={tw("text-xl")}>Aulas canceladas</Text>
						<View style={tw("text-xl")} >
							{canceledClasses.map((schedule) => (
								<>
									<Text>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text>
										{schedule.start_time} - {schedule.end_time}: {formatDisciplineName(schedule.discipline.name)} - {schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}
									</Text>
								</>
							))}
						</View>
					</View>

					<View style={tw("mt-4")}>
						<Text style={tw("text-xl")}>Aulas que foram substituídas</Text>
						<View style={tw("text-xl")} >
							{substituteClasses.map((schedule) => (
								<>
									<Text>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text>
										{schedule.start_time} - {schedule.end_time}: {formatDisciplineName(schedule.discipline.name)} - {schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}
									</Text>
								</>
							))}
						</View>
					</View>

					<View style={tw("mt-4")}>
						<Text style={tw("text-xl")}>Disciplinas por turma</Text>
						<View style={tw("text-xl")} >


							{/* {Object.entries(filteredDisciplines).map(([key, value]) => (
								<View>
									<Text>{key}</Text>
									<Text>Total de aulas previstas</Text>
									{value.map((schedule: Schedule) => (
										<View>
											<Text>{schedule.start_time}</Text>
										</View>
									))}
								</View>
							))} */}

							{/* <Text>
										{(new Date(schedule.class_date)).toLocaleDateString()}
									</Text>
									<Text>
										{schedule.start_time} - {schedule.end_time}: {formatDisciplineName(schedule.discipline.name)} - {schedule.schedule_class.course.byname}{schedule.schedule_class.shift[0]}{schedule.schedule_class.reference_period}
									</Text> */}

						</View>
					</View>

				</View>
			</Page>
		</Document>

	)
}