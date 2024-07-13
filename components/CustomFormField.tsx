/* eslint-disable no-unused-vars */
import { E164Number } from 'libphonenumber-js/core';
import Image from 'next/image';
import { Control } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Input } from './ui/input';

import React from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

export enum FormFieldType {
	INPUT = 'input',
	TEXTAREA = 'textarea',
	PHONE_INPUT = 'phoneInput',
	CHECKBOX = 'checkbox',
	DATE_PICKER = 'datePicker',
	SELECT = 'select',
	SKELETON = 'skeleton',
}

interface CustomProps {
	control: Control<any>;
	name: string;
	label?: string;
	placeholder?: string;
	iconSrc?: string;
	iconAlt?: string;
	disabled?: boolean;
	dateFormat?: string;
	showTimeSelect?: boolean;
	children?: React.ReactNode;
	renderSkeleton?: (field: any) => React.ReactNode;
	fieldType: FormFieldType;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
	const {
		control,
		name,
		label,
		placeholder,
		iconSrc,
		iconAlt,
		disabled,
		dateFormat,
		showTimeSelect,
		children,
		renderSkeleton,
		fieldType,
	} = props;
	switch (fieldType) {
		case FormFieldType.INPUT:
			return (
				<div className='p-1 rounded-md focus-within:gradient-border'>
					<div className='flex rounded-md bg-dark-400 border border-dark-500 focus-within:border focus-within:border-[#b6f09c]'>
						{props.iconSrc && (
							<Image
								src={props.iconSrc}
								height={24}
								width={24}
								alt={props.iconAlt || 'icon'}
								className='ml-2'
							/>
						)}
						<FormControl>
							<Input
								placeholder={props.placeholder}
								{...field}
								className='shad-input border-0'
							/>
						</FormControl>
					</div>
				</div>
			);
		case FormFieldType.PHONE_INPUT:
			return (
				<div className='p-1 rounded-md focus-within:gradient-border'>
					<div className='rounded-md bg-dark-400  focus-within:border focus-within:border-[#b6f09c]'>
						<FormControl>
							<PhoneInput
								defaultCountry='RU'
								placeholder={placeholder}
								international
								withCountryCallingCode
								value={field.value as E164Number | undefined}
								onChange={field.onChange}
								className='input-phone'
							/>
						</FormControl>
					</div>
				</div>
			);
		case FormFieldType.DATE_PICKER:
			return (
				<div className='flex rounded-md border border-dark-500 bg-dark-400'>
					<Image
						src='/assets/icons/calendar.svg'
						height={24}
						width={24}
						alt='calendar'
						className='ml-2'
					/>
					<FormControl>
						<DatePicker
							selected={field.value}
							onChange={(date) => field.onChange(date)}
							dateFormat={dateFormat ?? 'MM/dd/yyyy'}
							showTimeSelect={showTimeSelect ?? false}
							timeInputLabel='Time:'
							wrapperClassName='date-picker'
						/>
					</FormControl>
				</div>
			);
		case FormFieldType.SELECT:
			return (
				<FormControl>
					<Select
						onValueChange={field.onChange}
						defaultValue={field.value}>
						<FormControl>
							<SelectTrigger className='shad-select-trigger gradient-select-border'>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent className='shad-select-content'>
							{children}
						</SelectContent>
					</Select>
				</FormControl>
			);
		case FormFieldType.SKELETON:
			return renderSkeleton ? renderSkeleton(field) : null;
		case FormFieldType.TEXTAREA:
			return (
				<div className='p-1 rounded-md focus-within:gradient-border'>
					<div className='rounded-md bg-dark-400  focus-within:border focus-within:border-[#b6f09c]'>
						<FormControl>
							<Textarea
								placeholder={placeholder}
								{...field}
								className='shad-textArea'
								disabled={disabled}
							/>
						</FormControl>
					</div>
				</div>
			);
		case FormFieldType.CHECKBOX:
			return (
				<FormControl>
					<div className='flex items-center gap-4'>
						<Checkbox
							id={name}
							checked={field.value}
							onCheckedChange={field.onChange}
							className='checkbox-button'
						/>
						<label
							htmlFor={name}
							className='checkbox-label'>
							{label}
						</label>
					</div>
				</FormControl>
			);
		default:
			return null;
	}
};

const CustomFormField = (props: CustomProps) => {
	const { control, name, label, fieldType } = props;

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className='flex-1'>
					{fieldType !== FormFieldType.CHECKBOX && label && (
						<FormLabel className='shad-input-label'>{label}</FormLabel>
					)}
					<RenderInput
						field={field}
						props={props}
					/>

					<FormMessage className='shad-error' />
				</FormItem>
			)}
		/>
	);
};

export default CustomFormField;
