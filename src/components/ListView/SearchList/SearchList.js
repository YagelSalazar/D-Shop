import React from 'react';
import { Form, Input } from 'semantic-ui-react';

import './SearchList.scss';

export default function SearchList(props) {
	const { placeholder } = props;

	return (
		<div className='search-wrap'>
			<Form className='login-form__content'>
				<Form.Field>
					<Input type='text' name='search' placeholder={placeholder} icon='search' />
				</Form.Field>
			</Form>
		</div>
	);
}
