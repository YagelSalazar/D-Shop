import React from 'react';
import { Button } from 'semantic-ui-react';

import './GeneralButton.scss';

export default function GeneralButton(props) {
	const {
		onClick,
		type = 'button',
		content,
		color = 'primary',
		size = 'md',
	} = props;

	return (
		<Button
			onClick={onClick}
			type={type}
			className={`button-${color} button-size__${size}`}
		>
			{content}
		</Button>
	);
}
