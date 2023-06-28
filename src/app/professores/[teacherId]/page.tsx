"use client"

import { Tabs, theme } from 'flowbite-react';
import { Clock, Users, BookOpen, User, AtSign, Mail } from 'lucide-react';
import { api } from '@/services/api';
import { Teacher } from '@/interfaces/Teacher';
import ProfileButton from '@/components/ProfileButton';
import { useEffect, useState } from 'react';
import { flowbiteTheme } from '@/app/theme';
import Breadcrumb from '@/components/Breadcrumb';

interface TeacherProfileProps {
	params: {
		teacherId: string | number;
	};
}

export default function TeacherProfile({ params }: TeacherProfileProps) {
	const [teacher, setTeacher] = useState<Teacher>()

	const getTeacher = async () => {
		const { data } = await api.get(`/teachers/${params.teacherId}/`)

		setTeacher(data)
	}

	useEffect(() => {
		getTeacher();
	}, [])


	return (
		<>
			<Breadcrumb title="Professores">
				<section></section>
			</Breadcrumb>

			<div className='flex gap-4 items-center'>
				<User className="rounded-lg bg-primary-background w-16 h-16 p-3" color="#007EA7" />

				<div className='text-primary-dark'>
					<p className='font-semibold'>{teacher?.name}</p>
					<p className='text-sm'>Professor(a)</p>
				</div>
			</div>

			<div className="flex justify-between mt-3">
				<div className="flex items-center gap-x-1">
					<AtSign className="w-4 h-4 text-primary-dark" />
					<span>{teacher?.registration}</span>
				</div>

				<div className="flex items-center gap-x-1">
					<Mail className="w-4 h-4 text-primary-dark" />
					<span>{teacher?.email}</span>
				</div>

				<div className="flex items-center gap-x-1">
					<Clock className="w-4 h-4 text-primary-dark" />
					<span> aulas/semana</span>
				</div>
			</div>


			<Tabs.Group
				aria-label="Tabs with icons"
				style="underline"
				className='justify-end mt-3'
			>
				<Tabs.Item
					active
					icon={Clock}
					title="Horários de aula"
					className='outline-none'
				>
					<div className='flex flex-row gap-6'>
						<div className='flex flex-col gap-y-4 min-w-fit'>
							<ProfileButton type="export" title='Exportar horários' text='Mesmos horários em exibição' />
							<ProfileButton type="export" title='Exportar relatório' text='Relatório mensal com carga horária' />
						</div>


						<div className='flex flex-row flex-wrap gap-4'>
						</div>
					</div>

				</Tabs.Item>

				<Tabs.Item
					icon={Users}
					title="Turmas"
					className='outline-none'
				>
					<div className='flex flex-row flex-wrap justify-center gap-4'>
					</div>
				</Tabs.Item>
				
				<Tabs.Item
					icon={BookOpen}
					title="Disciplinas"
					className='outline-none'
				>
					<div className='flex flex-row gap-6'>
						<div className='flex flex-col gap-y-4 min-w-fit'>
							<ProfileButton type="bind" title='Vincular disciplina' text='Adicionar disciplina ao professor' />
						</div>

						<div className='flex flex-row flex-wrap gap-4'>
						</div>
					</div>
				</Tabs.Item>
			</Tabs.Group>
		</>
	)
}


