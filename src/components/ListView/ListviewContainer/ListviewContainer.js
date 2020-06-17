import React from 'react';
import { map } from 'lodash';

import ListviewDetail from '../ListviewDetail';
import Search from '../SearchList';

import './ListviewContainer.scss';
export default function ListviewContainer(props) {
	const { data, updateData, handlerModal, type, searchText } = props;

	const onClick = () => {
		handlerModal();
	};

	return (
		<div className='list-view'>
			<Search placeholder={searchText} />

			{map(data, (detail) => (
				<ListviewDetail
					onClick={() => onClick()}
					key={detail.id}
					detail={detail}
					type={type}
					updateData={updateData}
				/>
			))}
		</div>
	);
}
