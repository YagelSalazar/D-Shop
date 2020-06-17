import React from 'react';

import './ProfilePicture.scss';

const profileImg = require('../../../assets/img/admin.png');

export default function ProfilePicture(props) {
	const { user } = props;
	return (
		<div className='user-avatar'>
			<div className='user-avatar__image'>
				<img src={profileImg} alt='profile img' />
			</div>
			<span>selecciona una foto</span>
			<div className='content-detail__info'>
				<ul>
					<li>
						<b>Nombre:</b>
						{user.name}
					</li>
					<li>
						<b>Apellido(s): </b>
						{user.lname}
					</li>
					<li>
						<b>Teléfono: </b>
						{user.phone}
					</li>
					<li>
						<b>Correo: </b>
						{user.email}
					</li>
					<li>
						<b>Usuario: </b>
						{user.user}
					</li>
					<li>
						<b>Puesto: </b>
						{user.rol}
					</li>
				</ul>
			</div>
		</div>
	);
}
