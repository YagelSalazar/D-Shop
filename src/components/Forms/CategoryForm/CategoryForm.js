import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Radio, TextArea } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import * as moment from 'moment';
import firebase from '../../../utils/Firebase';
import { renameId } from '../../../utils/Api';

import './CategoryForm.scss';

const ProductForm = (props) => {
	const { updateData, data, setShowModal } = props;

	const db = firebase.firestore(firebase);

	const [formData, setFormData] = useState(initialFormState());
	const [formError, setFormError] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (data) {
			setFormData({
				name: data.name,
				description: data.description,
				available: data.available,
			});
		}
	}, [data]);

	const handlerCheckbox = (data) => {
		setFormData({
			...formData,
			[data.name]: data.checked,
		});
	};

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = () => {
		setFormError({});
		let errors = {};
		let formOk = true;

		if (!formData.name) {
			errors.name = true;
			formOk = false;
		}
		if (!formData.description) {
			errors.description = true;
			formOk = false;
		}
		setFormError(errors);
		if (formOk) {
			setIsLoading(true);
			if (data) {
				updateCategory();
			} else {
				createCategory();
			}
		}
	};

	const createCategory = () => {
		let user = firebase.auth().currentUser;
		const newId = renameId(`${formData.name}`);
		db
			.doc(`Categories/${newId}`)
			.get()
			.then((res) => {
				if (res.exists) {
					toast.error(
						'Ya hay una categoría registrada con el nombre que deseas ingresar.',
					);
				} else {
					db
						.doc(`Categories/${newId}`)
						.set({
							name: formData.name.toLowerCase(),
							description: formData.description.toLowerCase(),
							available: formData.available,
							products: [],
							createdAt: moment().format('L'),
							createdBy: user.displayName,
							updatedAt: '',
							updatedBy: '',
							id: newId,
						})
						.then(() => {
							updateData();
							setShowModal(false);
							toast.success('Categoría registrada correctaente.');
						})
						.catch((err) => {
							toast.error(`Error: ${err.code}`);
						})
						.finally(() => {
							setShowModal(false);
						});
				}
			})
			.catch((err) => {
				toast.error(`Error: ${err.code}`);
				setShowModal(false);
			});
		setIsLoading(false);
	};

	const updateCategory = () => {
		let user = firebase.auth().currentUser;
		db
			.doc(`Categories/${data.id}`)
			.update({
				name: formData.name.toLowerCase(),
				description: formData.description.toLowerCase(),
				available: formData.available,
				updatedAt: moment().format('L'),
				updatedBy: user.displayName,
			})
			.then(() => {
				updateData();
				toast.success('Categoría registrada correctaente.');
			})
			.catch((err) => {
				toast.error(`Error: ${err.code}`);
			});
		setIsLoading(false);
		setShowModal(false);
	};

	return (
		<div className='modal-form'>
			{!data && <h1>Registrar categoría</h1>}
			<Form
				onSubmit={onSubmit}
				onChange={onChange}
				className='modal-form__content'
			>
				<Form.Field>
					<Input
						type='text'
						name='name'
						value={formData.name}
						placeholder='Nombre de la categoría'
						icon='inbox'
						error={formError.name}
					/>
					{formError.name && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<TextArea
						name='description'
						className='input-textarea'
						value={formData.description}
						placeholder='Descripción'
						style={{ minHeight: 100, maxHeight: 100 }}
						error={`${formError.description}`}
					/>
					{formError.description && (
						<span className='error-text'>Campo obligatorio.</span>
					)}
				</Form.Field>
				<Form.Field>
					<Radio
						toggle
						name='available'
						checked={formData.available}
						className='input-radio'
						onChange={(e, data) => handlerCheckbox(data)}
						label={
							formData.available ? (
								<label className='text-gray'>Disponible</label>
							) : (
								<label className='text-gray'>No disponible</label>
							)
						}
					/>
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						content={!data ? 'Registrar categoría' : 'Actualizar'}
					/>
				</Form.Field>
			</Form>
		</div>
	);
};

function initialFormState() {
	return {
		name: '',
		description: '',
		available: true,
		createdAt: '',
		createdBy: '',
		updatedAt: '',
		updatedBy: '',
	};
}

export default ProductForm;
