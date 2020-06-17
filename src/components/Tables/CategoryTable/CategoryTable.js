import React, { useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { map } from 'lodash';
import { toast } from 'react-toastify';
import BasicModal from '../../Modal/BasicModal';
import CategoryForm from '../../Forms/CategoryForm';
import firebase from '../../../utils/Firebase';

import GeneralButton from '../../Button/GeneralButton';
import './CategoryTable.scss';

const db = firebase.firestore(firebase);

export default function CategoryTable() {
	const [categories, setCategories] = useState([]);
	const [ShowModal, setShowModal] = useState(false);
	const [titleModal, setTitleModal] = useState(null);
	const [contentModal, setContentModal] = useState(null);

	const handlerModal = (props) => {
		const { type, id, data } = props;
		switch (type) {
			case 'create':
				setShowModal(true);
				setContentModal(contentForm(data));
				setTitleModal('Crear categoría');
				break;
			case 'update':
				setShowModal(true);
				setContentModal(contentForm(data));
				setTitleModal('Actualizar información');
				break;
			case 'delete':
				setShowModal(true);
				setContentModal(contentDelete(id));
				setTitleModal('¿Deseas eliminar a este item?');
				break;

			default:
				break;
		}
	};

	const deleteItem = (id) => {
		db
			.collection('Categories')
			.doc(id)
			.delete()
			.then(() => {
				getAllCategories();
				toast.success('Item eliminado correctamente.');
			})
			.catch((err) => {
				toast.error(`Error: ${err.code}`);
			})
			.finally(() => {
				closeModal();
			});
	};

	const closeModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		getAllCategories();
	}, []);

	const getAllCategories = () => {
		db
			.collection('Categories')
			.get()
			.then((res) => {
				const arrayCategories = [];
				map(res?.docs, (category) => {
					const data = category.data();
					data.id = category.id;
					arrayCategories.push(data);
				});
				setCategories(arrayCategories);
			});
	};

	const contentDelete = (id) => {
		return (
			<div className='modal-delete'>
				<GeneralButton onClick={closeModal} content='Cancelar' />
				<GeneralButton
					onClick={() => deleteItem(id)}
					content='Eliminar'
					color='danger'
				/>
			</div>
		);
	};

	const contentForm = (data = null) => {
		return (
			<>
				<CategoryForm
					updateData={getAllCategories}
					setShowModal={setShowModal}
					data={data}
				/>
			</>
		);
	};

	return (
		<>
			<GeneralButton
				color='success'
				onClick={() => handlerModal({ type: 'create', data: null })}
				content='Nueva categoría'
			/>
			<div className='categories-container'>
				<div className='category-title'>
					<p className='name'>Nombre</p>
					<p className='description'>Descripción</p>
					<p className='date'>Fecha de registro</p>
					<p className='available'>Disponibilidad</p>
					<p className='actions'>Acciones</p>
				</div>
				{map(categories, (category) => (
					<div key={category.id} className='category'>
						<p className='name'>{category.name}</p>
						<p className='description'>{category.description}</p>
						<p className='date'>{category.createdAt}</p>
						<p className='available'>
							{category.available ? 'Disponible' : 'No disponible'}
						</p>
						<p className='actions'>
							<GeneralButton
								color='warning'
								size='sm'
								content={<Icon name='pencil square' />}
								onClick={() => handlerModal({ type: 'update', data: category })}
							/>
							<GeneralButton
								color='danger'
								size='sm'
								content={<Icon name='trash' />}
								onClick={() => handlerModal({ type: 'delete', id: category.id })}
							/>
						</p>
					</div>
				))}
			</div>
			<BasicModal show={ShowModal} setShow={setShowModal} title={titleModal}>
				{contentModal}
			</BasicModal>
		</>
	);
}
