import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Checkbox } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { validateEmail } from '../../../utils/Validations';
import { renameId } from '../../../utils/Api';
import firebase from '../../../utils/Firebase';
import * as moment from 'moment';

const ProfileForm = (props) => {
	const { updateData, employee, setShowModal } = props;

	const db = firebase.firestore(firebase);

	const [formData, setFormData] = useState(initialFormState());
	const [formError, setFormError] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (employee) {
			setFormData({
				name: employee.name,
				lName: employee.lName,
				phone: employee.phone,
				user: employee.user,
				email: employee.email,
				rol: employee.rol,
				permissionStock: employee.permissionStock,
				permissionProducts: employee.permissionProducts,
				permissionSales: employee.permissionSales,
				permissionCustomer: employee.permissionCustomer,
			});
		}
	}, [employee]);

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handlerCheckbox = (data) => {
		setFormData({
			...formData,
			[data.name]: data.checked,
		});
	};

	const handlerSelect = (data) => {
		setFormData({
			...formData,
			[data.name]: data.value,
		});
	};

	const rol = [
		{ key: 'sales', value: 'Ventas', text: 'Ventas' },
		{ key: 'production', value: 'Producción', text: 'Producción' },
		{ key: 'both', value: 'Ventas y producción', text: 'Ventas y producción' },
	];

	const onSubmit = () => {
		setFormError({});
		let errors = {};
		let formOk = true;

		if (!validateEmail(formData.email)) {
			errors.email = true;
			formOk = false;
		}
		if (!formData.name) {
			errors.name = true;
			formOk = false;
		}
		if (!formData.rol) {
			errors.rol = true;
			formOk = false;
		}
		if (!formData.lName) {
			errors.lName = true;
			formOk = false;
		}
		if (!formData.user.trim()) {
			errors.user = true;
			formOk = false;
		}
		setFormError(errors);

		if (formOk) {
			setIsLoading(true);
			if (employee) {
				updateUser();
			} else {
				createUser();
			}
		}
	};

	const createUser = () => {
		let user = firebase.auth().currentUser;
		const newId = renameId(`${formData.name} ${formData.lName}`);
		db
			.doc(`Employees/${newId}`)
			.get()
			.then((res) => {
				if (res.exists) {
					toast.error(
						'Ya hay un usuario registrado con el nombre que deseas ingresar.',
					);
				} else {
					db
						.doc(`/Employees/${newId}`)
						.set({
							name: formData.name,
							lName: formData.lName,
							phone: formData.phone,
							user: formData.user,
							email: formData.email,
							rol: formData.rol,
							permissionStock: formData.permissionStock,
							permissionProducts: formData.permissionProducts,
							permissionSales: formData.permissionSales,
							permissionCustomer: formData.permissionCustomer,
							createdAt: moment().format('L'),
							createdBy: user.displayName,
							userId: newId,
						})
						.catch((err) => {
							toast.error(`Error: ${err.code}`);
						});
				}
			})
			.then(() => {
				updateData();
				setFormData(initialFormState());
				toast.success('Empleado registrado correctaente.');
			})
			.catch((err) => {
				toast.error(`Error: ${err.code}`);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const updateUser = () => {
		db
			.collection('Employees')
			.doc(employee.id)
			.update({
				name: formData.name,
				lName: formData.lName,
				phone: formData.phone,
				user: formData.user,
				email: formData.email,
				rol: formData.rol,
				permissionStock: formData.permissionStock,
				permissionProducts: formData.permissionProducts,
				permissionSales: formData.permissionSales,
				permissionCustomer: formData.permissionCustomer,
			})
			.then(() => {
				toast.success('Empleado actualizado correctaente.');
				setFormData(initialFormState());
			})
			.catch((err) => {
				toast.error(err.code);
			})
			.finally(() => {
				setIsLoading(false);
				setShowModal(false);
			});
		updateData();
	};

	// const changeUserInfo = () => {
	// 	firebase
	// 		.auth()
	// 		.currentUser.updateProfile({
	// 			displayName: `${formData.name} ${formData.lName}`,
	// 		})
	// 		.then(() => {
	// 			setFormData(initialFormState());
	// 			updateData();
	// 		})
	// 		.catch((err) => {
	// 			toast.error(`Error: ${err.code}`);
	// 		});
	// };
	return (
		<div className='register-user'>
			{!employee && <h1>Registrar empleado</h1>}
			<Form
				onSubmit={onSubmit}
				onChange={onChange}
				className='register-user__form'
			>
				<Form.Field>
					<Input
						type='text'
						name='name'
						value={formData.name}
						placeholder='Nombre(s)'
						icon='user'
						error={formError.name}
					/>
					{formError.name && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<Input
						type='text'
						name='lName'
						value={formData.lName}
						placeholder='Apellidos'
						icon='user'
						error={formError.lName}
					/>
					{formError.lName && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<Input
						type='text'
						name='user'
						value={formData.user}
						placeholder='Usuario'
						icon='user'
						error={formError.user}
					/>
					{formError.user && (
						<span className='error-text'>Combina letras y números.</span>
					)}
				</Form.Field>
				<Form.Field>
					<Input
						type='text'
						name='phone'
						value={formData.phone}
						placeholder='Teléfono'
						icon='phone'
					/>
				</Form.Field>
				<Form.Field>
					<Input
						type='email'
						name='email'
						value={formData.email}
						placeholder='Correo'
						icon='mail'
						error={formError.email}
					/>
					{formError.email && <span className='error-text'>Email invalido.</span>}
				</Form.Field>
				<Form.Field>
					<Select
						name='rol'
						placeholder='Puesto'
						value={formData.rol}
						onChange={(e, data) => handlerSelect(data)}
						options={rol}
						error={formError.rol}
					/>
					{formError.rol && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<Checkbox
						name='permissionStock'
						checked={formData.permissionStock}
						className='input-checkbox'
						onChange={(e, data) => handlerCheckbox(data)}
						label={<label className='text-gray'>Permisos sobre stock</label>}
					/>
				</Form.Field>
				<Form.Field>
					<Checkbox
						name='permissionProducts'
						checked={formData.permissionProducts}
						className='input-checkbox'
						onChange={(e, data) => handlerCheckbox(data)}
						label={<label className='text-gray'>Permisos sobre productos</label>}
					/>
				</Form.Field>
				<Form.Field>
					<Checkbox
						name='permissionCustomer'
						className='input-checkbox'
						checked={formData.permissionCustomer}
						onChange={(e, data) => handlerCheckbox(data)}
						label={<label className='text-gray'>Permisos sobre clientes</label>}
					/>
				</Form.Field>
				<Form.Field>
					<Checkbox
						name='permissionSales'
						checked={formData.permissionSales}
						className='input-checkbox'
						onChange={(e, data) => handlerCheckbox(data)}
						label={<label className='text-gray'>Permisos sobre ventas</label>}
					/>
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						content={!employee ? 'Registrar usuario' : 'Actualizar'}
					/>
				</Form.Field>
			</Form>
		</div>
	);
};

function initialFormState() {
	return {
		name: '',
		lName: '',
		phone: '',
		user: '',
		email: '',
		password: '',
		rol: '',
		permissionStock: false,
		permissionProducts: false,
		permissionSales: false,
		permissionCustomer: false,
	};
}

export default ProfileForm;
