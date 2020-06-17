import React from 'react';
import { Link } from 'react-router-dom';

import './Card.scss';

export default function Card(props) {
	const { to = '/', image, title } = props;
	return (
		<>
			<Link to={to} className='menu-card'>
				<img className='menu-card__img' src={image} alt={title} />
				<h2 className='menu-card__title'>{title}</h2>
			</Link>
		</>
	);
}
