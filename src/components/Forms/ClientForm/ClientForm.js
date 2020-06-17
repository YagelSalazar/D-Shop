import React, { useState, useEffect } from 'react';
import {
	Button,
	Form,
	Input,
	Radio,
	Checkbox,
	TextArea,
} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import firebase from '../../../utils/Firebase';
import { renameId } from '../../../utils/Api';

const ClientForm = (props) => {
	const { updateData, data, setShowModal } = props;

	const db = firebase.firestore(firebase);

	const [formData, setFormData] = useState(initialFormState());
	const [formError, setFormError] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (data) {
			setFormData({
				name: data.name,
				lName: data.lName,
				phone: data.phone,
				address: data.address,
				regularClient: data.regularClient,
				wholesalePrice: data.wholesalePrice,
			});
		}
	}, [data]);

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

	const onSubmit = () => {
		setFormError({});
		let errors = {};
		let formOk = true;

		if (!formData.name.trim()) {
			errors.name = true;
			formOk = false;
		}
		if (!formData.lName.trim()) {
			errors.lName = true;
			formOk = false;
		}
		if (!formData.phone) {
			errors.phone = true;
			formOk = false;
		}
		setFormError(errors);
		if (formOk) {
			setIsLoading(true);
			if (data) {
				updateClient();
			} else {
				createClient();
			}
		}
	};

	const createClient = () => {
		let user = firebase.auth().currentUser;
		const newId = renameId(`${formData.name} ${formData.lName}`);
		console.log(newId);
		db
			.doc(`Clients/${newId}`)
			.get()
			.then((res) => {
				if (res.exists) {
					toast.error(
						'Ya hay un clinte registrado con el nombre que deseas ingresar.',
					);
				} else {
					db
						.doc(`Clients/${newId}`)
						.set({
							name: formData.name,
							lName: formData.lName,
							phone: formData.phone,
							address: formData.address,
							regularClient: formData.regularClient,
							wholesalePrice: formData.wholesalePrice,
							createdBy: user.displayName,
							createdAt: new Date().toISOString(),
							id: newId,
						})
						.then(() => {
							toast.success('Cliente registrado correctaente.');
							setFormData(initialFormState());
							updateData();
						})
						.catch((err) => {
							toast.error(`Codigo de error: ${err}`);
						});
				}
			})
			.catch((err) => {
				toast.error(`Error: ${err.code}`);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const updateClient = () => {
		db
			.doc(`/Clients/${data.id}`)
			.get()
			.then((resp) => {
				if (resp.exists) {
					db
						.doc(`/Clients/${data.id}`)
						.update({
							name: formData.name,
							lName: formData.lName,
							phone: formData.phone,
							address: formData.address,
							regularClient: formData.regularClient,
							wholesalePrice: formData.wholesalePrice,
						})
						.then(() => {
							toast.success('Cliente actualizado correctaente.');
							setFormData(initialFormState());
						})
						.catch((err) => {
							toast.error(err.code);
						});
				} else {
					toast.error('Algo salió mal, intenta más tarde.');
				}
			})
			.finally(() => {
				setIsLoading(false);
				setShowModal(false);
				updateData();
			});
	};
	return (
		<div className='register-user'>
			{!data && <h1>Registrar cliente</h1>}
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
						type='number'
						name='phone'
						value={formData.phone}
						placeholder='Teléfono'
						icon='phone'
						error={formError.lName}
					/>
					{formError.lName && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<TextArea
						name='address'
						className='input-textarea'
						value={formData.address}
						placeholder='Dirección'
						style={{ minHeight: 100, maxHeight: 100 }}
					/>
				</Form.Field>
				<Form.Field>
					<Checkbox
						name='regularClient'
						checked={formData.regularClient}
						className='input-checkbox'
						onChange={(e, data) => handlerCheckbox(data)}
						label={<label className='text-gray'>Cliente frecuente</label>}
					/>
				</Form.Field>
				<Form.Field>
					<Radio
						toggle
						name='wholesalePrice'
						checked={formData.wholesalePrice}
						className='input-radio'
						onChange={(e, data) => handlerCheckbox(data)}
						label={
							formData.wholesalePrice ? (
								<label className='text-gray'>Precio mayoreo activado</label>
							) : (
								<label className='text-gray'>Precio menudeo activado</label>
							)
						}
					/>
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						content={!data ? 'Registrar cliente' : 'Actualizar'}
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
		address: '',
		regularClient: false,
		wholesalePrice: false,
	};
}

export default ClientForm;
