import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import BasicModal from '../../Modal/BasicModal';
import ProductForm from '../../Forms/ProductForm';
import GeneralButton from '../../Button';
import firebase from '../../../utils/Firebase';

import './Cardview.scss';
import { toast } from 'react-toastify';

import noImage from '../../../assets/img/picture.png';

export default function ListviewDetail(props) {
	const { detail, updateData, type } = props;

	const db = firebase.firestore(firebase);

	const [ShowModal, setShowModal] = useState(false);
	const [titleModal, setTitleModal] = useState(null);
	const [contentModal, setContentModal] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		firebase
			.storage()
			.ref(`products/${detail.imageUrl}`)
			.getDownloadURL()
			.then((url) => {
				setImageUrl(url);
			});
	}, [detail]);

	const handlerModal = (type) => {
		switch (type) {
			case 'detail':
				setShowModal(true);
				setContentModal(contentDetail(detail));
				setTitleModal('Más detalles');
				break;
			case 'update':
				setShowModal(true);
				setContentModal(contentUpdate(detail));
				setTitleModal('Actualizar información');
				break;
			case 'delete':
				setShowModal(true);
				setContentModal(contentDelete);
				setTitleModal('¿Deseas eliminar a este item?');
				break;

			default:
				break;
		}
	};

	const deleteItem = () => {
		firebase
			.storage()
			.ref()
			.child(`products/${detail.imageUrl}`)
			.delete()
			.then(() => {
				db
					.collection(type)
					.doc(detail.id)
					.delete()
					.then(() => {
						updateData();
						toast.success('Item eliminado correctamente.');
					})
					.catch((err) => {
						toast.error(`Error: ${err.code}`);
					});
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

	const contentDelete = () => {
		return (
			<div className='modal-delete'>
				<GeneralButton onClick={closeModal} content='Cancelar' />
				<GeneralButton onClick={deleteItem} content='Eliminar' color='danger' />
			</div>
		);
	};

	const contentDetail = (detail) => {
		switch (type) {
			case 'Products':
				return (
					<div className='content-detail'>
						<div className='content-detail__avatar'>
							<img src={imageUrl ? imageUrl : noImage} alt='content avatar' />
						</div>
						<div className='content-detail__info'>
							<ul>
								<li>
									<b>Código:</b>
									{detail.code}
								</li>
								<li>
									<b>Nombre:</b>
									{detail.name}
								</li>
								<li>
									<b>Precio de mayoreo: </b>
									{detail.wholesalePrice}
								</li>
								<li>
									<b>Precio de menudeo: </b>
									{detail.retailPrice}
								</li>
								<li>
									<b>Unidad de medida: </b>
									{detail.unit}
								</li>
								<li>
									<b>Categoría: </b>
									{detail.category}
								</li>
								<li>
									<b>Fecha creación: </b>
									{`${detail.createdAt}`}
								</li>
								{detail.modifiedAt && (
									<li>
										<b>Fecha modificación: </b>
										{`${detail.createdAt}`}
									</li>
								)}
								<li>
									<b>Creado por: </b>
									{detail.createdBy}
								</li>
								{detail.modifiedBy && (
									<li>
										<b>Modificado por: </b>
										{`${detail.modifiedBy}`}
									</li>
								)}
							</ul>
						</div>
					</div>
				);
			default:
				return <h3>¡Opss! No hay nada que mostrar.</h3>;
		}
	};

	const contentUpdate = () => {
		switch (type) {
			case 'Products':
				return (
					<>
						<ProductForm
							data={detail}
							updateData={updateData}
							setShowModal={setShowModal}
						/>
					</>
				);
			default:
				return <h3>¡Opss! No hay nada que mostrar.</h3>;
		}
	};

	return (
		<>
			<div className='card-view__item' key={detail.id}>
				<div className='card-view__item-avatar'>
					<img src={imageUrl ? imageUrl : noImage} alt='product' />
				</div>
				<p className='card-view__item-name'>{detail.name}</p>
				<div className='card-view__item-actions'>
					<GeneralButton
						onClick={() => handlerModal('detail')}
						type='button'
						size='sm'
						color='success'
						content={<Icon name='eye' />}
					/>
					<GeneralButton
						onClick={() => handlerModal('update')}
						type='button'
						size='sm'
						color='warning'
						content={<Icon name='pen square' />}
					/>
					<GeneralButton
						onClick={() => handlerModal('delete')}
						type='button'
						size='sm'
						color='danger'
						content={<Icon name='trash' />}
					/>
				</div>
			</div>
			<BasicModal show={ShowModal} setShow={setShowModal} title={titleModal}>
				{contentModal}
			</BasicModal>
		</>
	);
}
