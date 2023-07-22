import React, { useEffect } from "react"
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"
import { createTw } from "react-pdf-tailwind";
import { weekdays } from "@/utils/dates";
import { Teacher } from "@/interfaces/Teacher";
import { Schedule } from "@/interfaces/Course";

const tw = createTw({
	theme: {
		extend: {
			colors: {
				primary: "#007EA7",
				gray: "#676767",
				black: "#3D3D3D",
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
};

export default function ExportTeacherWeekSchedulesPDF({ teacher, teacherSchedules, schedulesByTime }: ExportTeacherSchedulesProps) {
	return (
		<Document>
			<Page
				size="A4"
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					marginTop: 16,
				}}
			>

				<View>
					<Text>Agenda semanal de {teacher?.name}</Text>
				</View>

				<View>
					<View
						style={{
							display: "flex",
							flexDirection: "row"
						}}
					>
						{weekdays.map((day, index) => (
							<Text style={{
								/* minWidth: 200,
								maxWidth: 200, */
								padding: 5,
							}}>
								{day}
							</Text>
						))}
					</View>

					{teacherSchedules?.map((schedule) => (
						<View
							key={schedule.id}
							style={{
								/* display: "flex",
								flexDirection: "row" */
							}}
						>
							{schedule.start_time} - {schedule.end_time}
							{weekdays.map((day, index) => (
								<View
									key={`${schedule.id}-${day}`}
									style={{
										/* width: 150,
										alignItems: 'center',
										padding: 5, */
									}}
								>
									{schedule.weekday === index && schedule.discipline.code}
								</View>
							))}
						</View>
					))}

					<View >
						{weekdays.map((day, index) => (
							<Text style={{
								/* minWidth: 200,
								maxWidth: 200,
								padding: 45, */
							}}>
								{day}
							</Text>
						))}

						{teacherSchedules?.map((schedule) => (
							<View
								key={schedule.id}
								style={{
									/* display: "flex",
									flexDirection: "row" */
								}}
							>
								{schedule.start_time} - {schedule.end_time}
								{weekdays.map((day, index) => (
									<View
										key={`${schedule.id}-${day}`}
										style={{
											/* width: 150,
											alignItems: 'center',
											padding: 5, */
										}}
									>
										{schedule.weekday === index && schedule.discipline.code}
									</View>
								))}
							</View>
						))}

						{/* <View style={tw("flex flex-row")}>
							{weekdays.map((day, index) => (
								<View
									key={index}
									style={{
										display: "flex",
										flexDirection: "column"
									}}
								>
									{day}
									{teacherSchedules?.map((schedule) => (
										<>
											{schedule.weekday === index && schedule.discipline.code}
											<View
												key={`${schedule.id}-${day}`}
												style={{
													width: 150,
													borderStyle: 'solid',
													alignItems: 'center',
													padding: 5,
												}}
											>
												{schedule.weekday === index && schedule.discipline.code}
											</View>
										</>
									))}
								</View>
											))} */}

						<View>
							{/* <Text>
								  {Object.keys(schedulesByTime).map((sch) => (
										<View>{sch}</View>
									))}
								</Text> */}
						</View>

					</View>
				</View>

			</Page>
		</Document >
	)
}