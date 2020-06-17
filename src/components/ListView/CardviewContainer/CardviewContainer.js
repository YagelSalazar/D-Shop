import React from 'react';
import { map } from 'lodash';

import Cardview from '../Cardview';
import Search from '../SearchList';

import './CardviewContainer.scss';
export default function ListviewContainer(props) {
	const { data, updateData, handlerModal, type, searchText } = props;

	const onClick = () => {
		handlerModal();
	};

	return (
		<>
			<Search placeholder={searchText} />
			<div className='card-view'>
				{map(data, (detail) => (
					<Cardview
						onClick={() => onClick()}
						key={detail.id}
						detail={detail}
						type={type}
						updateData={updateData}
					/>
				))}
			</div>
		</>
	);
}
