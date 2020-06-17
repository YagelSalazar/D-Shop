import React, { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { validateEmail } from '../../../utils/Validations';
import firebase from '../../../utils/Firebase';
import { toast } from 'react-toastify';
import './ForgotForm.scss';

import logo from '../../../assets/img/ice-cream.png';

export default function ForgotForm(props) {
	const { setSelectedForm } = props;
	const [dataForm, setDataForm] = useState({
		email: '',
	});
	const [formError, setFormError] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = () => {
		setFormError({});
		let errors = {};
		let formOk = true;

		if (!validateEmail(dataForm.email)) {
			errors.email = true;
			formOk = false;
		}
		setFormError(errors);
		if (formOk) {
			setIsLoading(true);
			firebase
				.auth()
				.sendPasswordResetEmail(dataForm.email)
				.then(function () {
					toast.success('Código enviado, revisa tu correo.');
					setSelectedForm('login');
				})
				.catch((err) => {
					toast.error('Algo salió mal, intenta más tarde.');
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const onChange = (e) => {
		setDataForm({
			...dataForm,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className='login-form'>
			<img className='login-form__logo' src={logo} alt='ice-cream' />
			<h1 className='login-form__title'>Recuperar contraseña</h1>
			<Form
				className='login-form__content'
				onSubmit={onSubmit}
				onChange={onChange}
			>
				<Form.Field>
					<Input
						type='email'
						name='email'
						value={dataForm.email}
						placeholder='Correo electrónico'
						icon='mail'
						error={formError.email}
					/>
					{formError.email && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						content='Enviar códico'
					/>
				</Form.Field>
				<Form.Field className='link-form'>
					<span
						onClick={(e) => setSelectedForm('login')}
						className='link-form__text'
					>
						Inicio de sesión
					</span>
				</Form.Field>
			</Form>
		</div>
	);
}
