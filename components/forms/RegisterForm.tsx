'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl } from '@/components/ui/form';
import { registerPatient } from '@/lib/actions/patient.actions';
import { PatientFormValidation } from '@/lib/validation';

import {
	Doctors,
	GenderOptions,
	IdentificationTypes,
	PatientFormDefaultValues,
} from '@/constants';
import Image from 'next/image';
import 'react-phone-number-input/style.css';
import CustomFormField, { FormFieldType } from '../CustomFormField';
import FileUpploader from '../FileUpploader';
import SubmitButton from '../SubmitButton';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { SelectItem } from '../ui/select';

export const RegisterForm = ({ user }: { user: User }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			...PatientFormDefaultValues,
			name: '',
			email: '',
			phone: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
		setIsLoading(true);
		let formData;
		if (
			values.identificationDocument &&
			values.identificationDocument?.length > 0
		) {
			const blobFile = new Blob([values.identificationDocument[0]], {
				type: values.identificationDocument[0].type,
			});

			formData = new FormData();
			formData.append('blobFile', blobFile);
			formData.append('fileName', values.identificationDocument[0].name);
		}

		try {
			const patient = {
				userId: user.$id,
				name: values.name,
				email: values.email,
				phone: values.phone,
				birthDate: new Date(values.birthDate),
				gender: values.gender,
				address: values.address,
				occupation: values.occupation,
				emergencyContactName: values.emergencyContactName,
				emergencyContactNumber: values.emergencyContactNumber,
				primaryPhysician: values.primaryPhysician,
				insuranceProvider: values.insuranceProvider,
				insurancePolicyNumber: values.insurancePolicyNumber,
				allergies: values.allergies,
				currentMedication: values.currentMedication,
				familyMedicalHistory: values.familyMedicalHistory,
				pastMedicalHistory: values.pastMedicalHistory,
				identificationType: values.identificationType,
				identificationNumber: values.identificationNumber,
				identificationDocument: values.identificationDocument
					? formData
					: undefined,
				privacyConsent: values.privacyConsent,
			};

			const newPatient = await registerPatient(patient);

			if (newPatient) {
				router.push(`/patients/${user.$id}/new-appointment`);
			}
		} catch (error) {
			console.log(error);
		}

		setIsLoading(false);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex-1 space-y-12'>
				<section className='space-y-4'>
					<h1 className='header'>Welcome 👋</h1>
					<p className='text-dark-700'>Let us know more about yourself</p>
				</section>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Personal Information</h2>
					</div>
				</section>

				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name='name'
					label='Full name'
					placeholder='ex: John Doe'
					iconSrc='/assets/icons/user.svg'
					iconAlt='user'
				/>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='email'
						label='Email'
						placeholder='ex: johndoe@gmail.com'
						iconSrc='/assets/icons/email.svg'
						iconAlt='email'
					/>

					<CustomFormField
						fieldType={FormFieldType.PHONE_INPUT}
						control={form.control}
						name='phone'
						label='Phone number'
						placeholder='ex: (555) 123-4567'
					/>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<CustomFormField
						fieldType={FormFieldType.DATE_PICKER}
						control={form.control}
						name='birthDate'
						label='Date of Birth'
						placeholder='Select your birth date'
					/>

					<CustomFormField
						fieldType={FormFieldType.SKELETON}
						control={form.control}
						name='gender'
						label='Gender'
						renderSkeleton={(field) => (
							<FormControl>
								<RadioGroup
									className='flex h-11 gap-6 xl:justify-between'
									onValueChange={field.onChange}
									defaultValue={field.value}>
									{GenderOptions.map((option) => (
										<div
											key={option}
											className='radio-group'>
											<RadioGroupItem
												value={option}
												id={option}
												className='shad-radio'
											/>
											<Label
												htmlFor={option}
												className='cursor-pointer'>
												{option}
											</Label>
										</div>
									))}
								</RadioGroup>
							</FormControl>
						)}
					/>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='address'
						label='Address'
						placeholder='ex: 14th Street, New York'
					/>

					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='occupation'
						label='Occupation'
						placeholder='ex: Software Engineer'
					/>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='emergencyContactName'
						label='Emergency contact name'
						placeholder="Guardian's name"
					/>

					<CustomFormField
						fieldType={FormFieldType.PHONE_INPUT}
						control={form.control}
						name='emergencyContactNumber'
						label='Emergency contact number'
						placeholder='ex: +1 (868) 579-9831'
					/>
				</div>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Medical Information</h2>
					</div>
				</section>

				<CustomFormField
					fieldType={FormFieldType.SELECT}
					control={form.control}
					name='primaryPhysician'
					label='Primary care physician'
					placeholder='Select a physician'>
					{Doctors.map((doctor) => (
						<SelectItem
							key={doctor.name}
							value={doctor.name}>
							<div className='flex cursor-pointer items-center gap-2'>
								<Image
									src={doctor.image}
									width={32}
									height={32}
									className='rounded-full border border-dark-500'
									alt={doctor.name}
								/>
								<p>{doctor.name}</p>
							</div>
						</SelectItem>
					))}
				</CustomFormField>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='insuranceProvider'
						label='Insurance provider'
						placeholder='ex: BlueCross'
					/>

					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name='insurancePolicyNumber'
						label='Insurance policy number'
						placeholder='ex: ABC1234567'
					/>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='allergies'
						label='Allergies (if any)'
						placeholder='ex: Peanuts, Penicillin, Pollen'
					/>

					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='currentMedication'
						label='Current medications'
						placeholder='ex: Ibuprofen 200mg, Levothyroxine 50mcg'
					/>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='familyMedicalHistory'
						label='Family medical history (if relevant)'
						placeholder='ex: Mother had breast cancer'
					/>

					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='pastMedicalHistory'
						label='Past medical history'
						placeholder='ex: Asthma diagnosis in childhood'
					/>
				</div>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Identification and Verfication</h2>
					</div>
				</section>

				<CustomFormField
					fieldType={FormFieldType.SELECT}
					control={form.control}
					name='identificationType'
					label='Identification Type'
					placeholder='Select an identification type'>
					{IdentificationTypes.map((type) => (
						<SelectItem
							key={type}
							value={type}>
							{type}
						</SelectItem>
					))}
				</CustomFormField>

				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name='identificationNumber'
					label='Identification Number'
					placeholder='ex: 1234567'
				/>

				<CustomFormField
					fieldType={FormFieldType.SKELETON}
					control={form.control}
					name='identificationDocument'
					label='Scanned Copy of Identification Document'
					renderSkeleton={(field) => (
						<FormControl>
							<FileUpploader
								files={field.value}
								onChange={field.onChange}
							/>
						</FormControl>
					)}
				/>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Consent and Privacy</h2>
					</div>
				</section>

				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='treatmentConsent'
					label='I consent to receive treatment for my health condition.'
				/>

				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='disclosureConsent'
					label='I consent to the use and disclosure of my health information for treatment purposes.'
				/>

				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='privacyConsent'
					label='I acknowledge that I have reviewed and agree to the privacy policy'
				/>

				<SubmitButton isLoading={isLoading}>Submit and continue</SubmitButton>
			</form>
		</Form>
	);
};
