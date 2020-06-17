import React, { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { validateEmail, validatePassword } from '../../../utils/Validations';
import firebase from '../../../utils/Firebase';
import './LoginForm.scss';
import { toast } from 'react-toastify';

const logo = require('../../../assets/img/ice-cream.png');

export default function LoginForm(props) {
	const db = firebase.firestore(firebase);

	const { setSelectedForm } = props;

	const [loginForm, setLoginForm] = useState({
		email: '',
		password: '',
	});
	const [formErrors, setFormErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = () => {
		setFormErrors({});
		let errors = {};
		let formOk = true;

		if (!validateEmail(loginForm.email)) {
			errors.email = true;
			formOk = false;
		}
		if (!validatePassword(loginForm.password)) {
			errors.password = true;
			formOk = false;
			toast.warning(
				'El formato de la contraseña debe tener letras, números y un minímo de 8 digítos.',
			);
		}
		setFormErrors(errors);

		if (formOk) {
			setIsLoading(true);
			db
				.collection('Employees')
				.doc(loginForm.email)
				.get()
				.then((resp) => {
					console.log(resp.data());
					if (resp.exists) {
						firebase
							.auth()
							.signInWithEmailAndPassword(loginForm.email, loginForm.password)
							.then((res) => {
								updateDisplayName(resp.data());
								toast.success('Bienvenido');
							})
							.catch((err) => {
								if (err.code === 'auth/user-not-found' && resp.exists) {
									toast.warning('Cuenta activada, bienvenido.');
									firebase
										.auth()
										.createUserWithEmailAndPassword(loginForm.email, loginForm.password)
										.then((res) => {
											updateDisplayName(resp.data());
										});
								} else {
									showLoginErrors(err.code);
								}
							});
					} else {
						toast.warning('Cuenta no registrada por el administrador.');
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const updateDisplayName = (data) => {
		let user = firebase.auth().currentUser;
		user
			.updateProfile({
				displayName: `${data.name} ${data.lName}`,
			})
			.catch((err) => {
				toast.error('Error al actualizar nombre del perfil.');
			});
	};

	const onChange = (e) => {
		setLoginForm({
			...loginForm,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className='login-form'>
			<img className='login-form__logo' src={logo} alt='ice-cream' />
			<h1 className='login-form__title'>Inicio de sesión</h1>
			<Form
				className='login-form__content'
				onSubmit={onSubmit}
				onChange={onChange}
			>
				<Form.Field>
					<Input
						type='email'
						name='email'
						placeholder='Correo o usuario'
						icon='user'
						error={formErrors.email}
					/>
					{formErrors.email && <span className='error-text'>Email invalido.</span>}
				</Form.Field>
				<Form.Field>
					<Input
						type='password'
						name='password'
						placeholder='Contraseña'
						icon='lock'
						error={formErrors.password}
					/>
					{formErrors.password && (
						<span className='error-text'>Campo obligatorio.</span>
					)}
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						// loading={isLoading}
						content='Iniciar sesión'
					/>
				</Form.Field>
				<Form.Field className='link-form'>
					<span
						onClick={(e) => setSelectedForm('forgot')}
						className='link-form__text'
					>
						Recuperar contraseña
					</span>
				</Form.Field>
			</Form>
		</div>
	);
}

function showLoginErrors(code) {
	switch (code) {
		case 'auth/user-not-found':
			toast.error('Usuario incorrecto.');
			break;
		case 'auth/wrong-password':
			toast.error('Contraseña incorrecta.');
			break;
		default:
			break;
	}
}
