import React from "react";

interface SearchBarProps{
	placeholder: string;
}

export default function SearchBar({placeholder}: SearchBarProps): React.ReactNode{
	return(
		<div>
			<form>   
				<label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">{placeholder}</label>

				<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg aria-hidden="true" className="w-5 h-5 text-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
						</div>
						<input type="search" className="block py-3 pl-10 pr-5 text-placeholder text-sm border-none rounded-lg bg-gray-50 focus:ring-primary focus:border-primary w-1/3" placeholder={placeholder} required/>						
				</div>
			</form>
		</div>
	)
}