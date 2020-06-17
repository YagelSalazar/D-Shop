import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Input, Select } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { map } from 'lodash';
import { Image } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { renameId } from '../../../utils/Api';
import * as moment from 'moment';

import firebase from '../../../utils/Firebase';

import './ProductForm.scss';
import noImage from '../../../assets/img/picture.png';

const db = firebase.firestore(firebase);

const ProductForm = (props) => {
	const { updateData, data, setShowModal } = props;

	const [formData, setFormData] = useState(initialFormState());
	const [formError, setFormError] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState(null);
	const [categories, setCategories] = useState(null);

	useEffect(() => {
		if (data) {
			setFormData({
				code: data.code,
				name: data.name,
				wholesalePrice: data.wholesalePrice,
				retailPrice: data.retailPrice,
				unit: data.unit,
				category: data.category,
				imageUrl: data.imageUrl,
			});
		}
	}, [data]);

	const onDrop = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];
		setImageUrl(file);
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/jpeg, image/png',
		noKeyboard: true,
		onDrop,
	});

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handlerSelect = (data) => {
		setFormData({
			...formData,
			[data.name]: data.value,
		});
	};

	const unit = [
		{ key: 'piezas', value: 'piezas', text: 'piezas' },
		{ key: 'cajas', value: 'cajas', text: 'cajas' },
		{ key: 'botes', value: 'botes', text: 'botes' },
		{ key: 'metros', value: 'metros', text: 'metros' },
		{ key: 'cm', value: 'cm', text: 'centímetros' },
		{ key: 'kg', value: 'kg', text: 'kilogramos' },
		{ key: 'g', value: 'g', text: 'gramos' },
		{ key: 'l', value: 'l', text: 'litros' },
		{ key: 'ml', value: 'ml', text: 'mililitros' },
	];

	const getAllCategories = () => {
		if (categories === null) {
			console.log('get cat');
			db
				.collection('Categories')
				.get()
				.then((res) => {
					const arrayCategories = [];
					map(res?.docs, (category) => {
						const data = {};
						data.key = category.data().name;
						data.value = category.data().name;
						data.text = category.data().name;
						console.log(data);
						arrayCategories.push(data);
					});
					setCategories(arrayCategories);
				});
		}
	};

	const uploadImage = (fileName) => {
		const ref = firebase.storage().ref().child(`products/${fileName}`);
		return ref.put(imageUrl);
	};

	const onSubmit = () => {
		setFormError({});
		let errors = {};
		let formOk = true;

		if (!formData.code || formData.code.length < 6) {
			toast.error('El código debe ser un número de al menos 6 digítos.');
			errors.name = true;
			formOk = false;
		}
		if (!formData.name) {
			errors.name = true;
			formOk = false;
		}
		if (!formData.wholesalePrice) {
			errors.wholesalePrice = true;
			formOk = false;
		}
		if (!formData.retailPrice) {
			errors.retailPrice = true;
			formOk = false;
		}
		if (!formData.unit) {
			errors.unit = true;
			formOk = false;
		}
		if (!formData.category) {
			errors.category = true;
			formOk = false;
		}
		if (!data) {
			if (!imageUrl) {
				formOk = false;
				toast.error('Debes agregar una imágen.');
			}
		}
		setFormError(errors);

		if (formOk) {
			setIsLoading(true);
			if (data) {
				updateProduct();
			} else {
				createProduct();
			}
		}
	};

	const createProduct = () => {
		let user = firebase.auth().currentUser;
		const newId = renameId(`${formData.name} ${formData.code}`);
		console.log(newId);
		db
			.doc(`Products/${newId}`)
			.get()
			.then((res) => {
				if (res.exists) {
					toast.error('Ya hay un producto registrado con este nombre o código.');
				} else {
					const fileName = uuidv4();
					uploadImage(fileName)
						.then(() => {
							db
								.doc(`Products/${newId}`)
								.set({
									code: formData.code,
									name: formData.name,
									wholesalePrice: formData.wholesalePrice,
									retailPrice: formData.retailPrice,
									unit: formData.unit,
									category: formData.category,
									imageUrl: fileName,
									createdAt: moment().format('L'),
									createdBy: user.displayName,
									modifiedAt: '',
									modifiedBy: '',
									id: newId,
								})
								.then(() => {
									updateData();
									toast.success('Producto registrado correctaente.');
									setFormData(initialFormState());
								})
								.catch((err) => {
									toast.error(`Error: ${err.code}`);
								});
						})
						.catch((err) => {
							console.log(`Error: ${err}`);
							toast.error('Error al subir la imágen, inetenta más tarde.');
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

	const updateProduct = () => {
		let user = firebase.auth().currentUser;
		let productDetails = {};
		if (imageUrl) {
			firebase
				.storage()
				.ref()
				.child(`products/${formData.imageUrl}`)
				.delete()
				.then(() => {
					const fileName = uuidv4();
					uploadImage(fileName)
						.then(() => {
							productDetails = {
								code: formData.code,
								name: formData.name,
								wholesalePrice: formData.wholesalePrice,
								retailPrice: formData.retailPrice,
								unit: formData.unit,
								category: formData.category,
								imageUrl: fileName,
								modifiedAt: moment().format('L'),
								modifiedBy: user.displayName,
							};
							setProductsDetail(productDetails);
						})
						.catch((err) => {
							toast.error(`Error: ${err.code}`);
						});
				})
				.catch((err) => {
					console.log(err.code);
					toast.error('Error al actualizar la imágen, intenta más tarde.');
				});
		} else {
			productDetails = {
				name: formData.name,
				wholesalePrice: formData.wholesalePrice,
				retailPrice: formData.retailPrice,
				unit: formData.unit,
				category: formData.category,
				modifiedAt: moment().format('L'),
				modifiedBy: user.displayName,
			};
			setProductsDetail(productDetails);
		}

		setIsLoading(false);
		setShowModal(false);
	};

	const setProductsDetail = (detailsProd) => {
		db
			.collection('Products')
			.doc(data.id)
			.update(detailsProd)
			.then(() => {
				updateData();
				toast.success('Producto actualizado correctaente.');
			})
			.catch((err) => {
				toast.error(err.code);
			});
	};

	return (
		<div className='register-user'>
			{!data && <h1>Registrar producto</h1>}
			<Form
				onSubmit={onSubmit}
				onChange={onChange}
				className='register-user__form'
			>
				<Form.Field>
					<Input
						type='number'
						name='code'
						value={formData.code}
						placeholder='Código del producto'
						icon='user'
						error={formError.code}
					/>
					{formError.code && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<Input
						type='text'
						name='name'
						value={formData.name}
						placeholder='Nombre del producto'
						icon='user'
						error={formError.name}
					/>
					{formError.name && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<Input
						type='number'
						name='wholesalePrice'
						value={formData.wholesalePrice}
						placeholder='Precio de mayoreo'
						icon='dollar'
						error={formError.wholesalePrice}
					/>
					{formError.wholesalePrice && (
						<span className='error-text'>Campo obligatorio.</span>
					)}
				</Form.Field>
				<Form.Field>
					<Input
						type='number'
						name='retailPrice'
						value={formData.retailPrice}
						placeholder='Precio de menudeo'
						icon='dollar'
						error={formError.retailPrice}
					/>
					{formError.retailPrice && (
						<span className='error-text'>Campo obligatorio.</span>
					)}
				</Form.Field>
				<Form.Field>
					<Select
						name='unit'
						placeholder='Unidad'
						value={formData.unit}
						onChange={(e, data) => handlerSelect(data)}
						options={unit}
						error={formError.unit}
					/>
					{formError.unit && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<Select
						name='category'
						placeholder={'Categorīas'}
						value={formData.category}
						onClick={() => getAllCategories()}
						onChange={(e, data) => handlerSelect(data)}
						options={categories !== null ? categories : []}
						error={formError.category}
					/>
					{formError.category && (
						<span className='error-text'>Campo obligatorio.</span>
					)}
				</Form.Field>
				<Form.Field>
					<div className='upload-image'>
						<div className='upload-image__content' {...getRootProps()}>
							<input {...getInputProps()} />
							<Image src={noImage} />
						</div>
					</div>
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						content={!data ? 'Registrar producto' : 'Actualizar'}
					/>
				</Form.Field>
			</Form>
		</div>
	);
};

function initialFormState() {
	return {
		code: '',
		name: '',
		wholesalePrice: '',
		retailPrice: '',
		unit: '',
		category: '',
		imageUrl: '',
		createdAt: '',
		createdBy: '',
	};
}

export default ProductForm;
