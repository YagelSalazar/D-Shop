import React from 'react';
import { Modal, Icon } from 'semantic-ui-react';

import './BasicModal.scss';

export default function BasicModal(props) {
	const { show, setShow, title, children, size = 'tiny' } = props;

	const onClose = () => {
		setShow(false);
	};

	return (
		<Modal open={show} onClose={onClose} className='basic-modal' size={size}>
			<Modal.Header>
				<h3>{title}</h3>
				<Icon name='close' onClick={onClose} />
			</Modal.Header>
			<Modal.Content>{children}</Modal.Content>
		</Modal>
	);
}
