import React, { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { validatePassword } from '../../../utils/Validations';
import { reathenticate } from '../../../utils/Api';
import firebase from '../../../utils/Firebase';
import './UpdateProfile.scss';

export default function UpdatePasswordForm(props) {
	const [formData, setFormData] = useState(initialFormState());
	const [isLoading, setIsLoading] = useState(false);

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = () => {
		if (
			!validatePassword(formData.currentPassword) ||
			!validatePassword(formData.newPassword) ||
			!validatePassword(formData.repeatPassword)
		) {
			toast.warning(
				'Las contraseñas no pueden ser vacias, combina letras y números y usa al menos 8 digítos.',
			);
		} else if (formData.currentPassword === formData.newPassword) {
			toast.error('La nueva contraseña no puede ser igual a la actual.');
		} else if (formData.newPassword !== formData.repeatPassword) {
			toast.warning('Las contraseñas no coinciden.');
		} else {
			setIsLoading(true);
			reathenticate(formData.currentPassword)
				.then(() => {
					const currentUser = firebase.auth().currentUser;
					currentUser
						.updatePassword(formData.newPassword)
						.then(() => {
							setFormData(initialFormState());
							toast.success('Contraseña actualizada correctamente');
						})
						.catch(() => {
							toast.error('Error inesperado, intenta más tarde.');
						});
				})
				.catch(() => {
					toast.error('Contraseña actual incorrecta.');
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};
	return (
		<div className='profile-update'>
			<Form
				onSubmit={onSubmit}
				onChange={onChange}
				className='register-user__form'
			>
				<Form.Field>
					<Input
						type='password'
						name='currentPassword'
						value={formData.currentPassword}
						placeholder='Contraseña actual'
						icon='lock'
					/>
				</Form.Field>
				<Form.Field>
					<Input
						type='password'
						name='newPassword'
						value={formData.newPassword}
						placeholder='Nueva contraseña'
						icon='lock'
					/>
				</Form.Field>
				<Form.Field>
					<Input
						type='password'
						name='repeatPassword'
						value={formData.repeatPassword}
						placeholder='Confirmar nueva contraseña'
						icon='lock'
					/>
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						content='Actualziar contraseña'
					/>
				</Form.Field>
			</Form>
		</div>
	);
}

function initialFormState() {
	return {
		currentPassword: '',
		newPassword: '',
		repeatPassword: '',
	};
}
