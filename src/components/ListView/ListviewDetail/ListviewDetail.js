import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import BasicModal from '../../Modal/BasicModal';
import UsersForm from '../../Forms/UsersForm';
import ClientForm from '../../Forms/ClientForm';
import GeneralButton from '../../Button';
import firebase from '../../../utils/Firebase';

import './ListviewDetail.scss';
import { toast } from 'react-toastify';

const imgAvatar = require('../../../assets/img/admin.png');
const imgClient = require('../../../assets/img/clients.png');

export default function ListviewDetail(props) {
	const { detail, updateData, type } = props;

	const db = firebase.firestore(firebase);

	const [ShowModal, setShowModal] = useState(false);
	const [titleModal, setTitleModal] = useState(null);
	const [contentModal, setContentModal] = useState(null);

	const handlerModal = (type) => {
		switch (type) {
			case 'detail':
				setShowModal(true);
				setContentModal(contentDetail);
				setTitleModal('Más detalles');
				break;
			case 'update':
				setShowModal(true);
				setContentModal(contentUpdate);
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
		db
			.collection(type)
			.doc(detail.id)
			.delete()
			.then(() => {
				toast.success('Item eliminado correctamente.');
			})
			.catch((err) => {
				toast.error(`Error: ${err.code}`);
			})
			.finally(() => {
				closeModal();
				updateData();
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

	const contentDetail = () => {
		switch (type) {
			case 'Clients':
				return (
					<div className='content-detail'>
						<div className='content-detail__avatar'>
							<img src={imgClient} alt='content avatar' />
						</div>
						<div className='content-detail__info'>
							<ul>
								<li>
									<b>Nombre:</b>
									{detail.name}
								</li>
								<li>
									<b>Apellido(s): </b>
									{detail.lName}
								</li>
								<li>
									<b>Teléfono: </b>
									{detail.phone}
								</li>
								<li>
									<b>Dirección: </b>
									{detail.address}
								</li>
								<li>
									<b>Fecha de creación: </b>
									{detail.createdAt}
								</li>
								<li>
									<b>Creado por: </b>
									{detail.createdBy}
								</li>
								<li>
									<b>Cliente frecuente: </b>
									{detail.regularClient ? 'si' : 'no'}
								</li>
								<li>
									<b>Precio de venta: </b>
									{detail.wholesalePrice ? 'mayoreo' : 'menudeo'}
								</li>
							</ul>
						</div>
					</div>
				);
			case 'Employees':
				return (
					<div className='content-detail'>
						<div className='content-detail__avatar'>
							<img src={imgAvatar} alt='content avatar' />
						</div>
						<div className='content-detail__info'>
							<ul>
								<li>
									<b>Nombre:</b>
									{detail.name}
								</li>
								<li>
									<b>Apellido(s): </b>
									{detail.lName}
								</li>
								<li>
									<b>Teléfono: </b>
									{detail.phone}
								</li>
								<li>
									<b>Correo: </b>
									{detail.email}
								</li>
								<li>
									<b>Usuario: </b>
									{detail.user}
								</li>
								<li>
									<b>Puesto: </b>
									{detail.rol}
								</li>
								<li>
									<b>Permisos de Stock: </b>
									{detail.permissionStock ? 'si' : 'no'}
								</li>
								<li>
									<b>Permisos de Clientes: </b>
									{detail.permissionCustomer ? 'si' : 'no'}
								</li>
								<li>
									<b>Permisos de Ventas: </b>
									{detail.permissionSales ? 'si' : 'no'}
								</li>
								<li>
									<b>Permisos de Productos: </b>
									{detail.permissionProducts ? 'si' : 'no'}
								</li>
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
			case 'Clients':
				return (
					<>
						<ClientForm
							data={detail}
							updateData={updateData}
							setShowModal={setShowModal}
						/>
					</>
				);
			case 'Employees':
				return (
					<>
						<UsersForm
							employee={detail}
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
			<div className='list-view__item'>
				<div className='list-view__item-avatar'>
					<img src={type === 'Employees' ? imgAvatar : imgClient} alt='my avatar' />
				</div>
				<div className='list-view__item-name'>
					<span>{`${detail.name} ${detail.lName}`}</span>
				</div>
				<div className='list-view__item-actions'>
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
