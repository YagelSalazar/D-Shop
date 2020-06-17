import React, { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import firebase from '../../../utils/Firebase';

import './UpdateProfile.scss';

export default function UpdateProfileForm(props) {
	const { getUserData } = props;
	const db = firebase.firestore(firebase);

	const [formData, setFormData] = useState(initialFormState());
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState(null);

	firebase.auth().onAuthStateChanged((currentUser) => {
		if (!currentUser) {
			firebase.auth().signOut();
			setUser(null);
		} else {
			setUser(currentUser);
		}
	});

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = () => {
		setIsLoading(true);
		const userInfo = {};
		formData.name && (userInfo.name = formData.name);
		formData.lname && (userInfo.lName = formData.lname);
		formData.phone && (userInfo.phone = formData.phone);
		formData.user && (userInfo.user = formData.user);
		updateUser(userInfo);
	};
	const updateUser = (userInfo) => {
		db
			.collection('Employees')
			.doc(user.email)
			.update(userInfo)
			.then(() => {
				toast.success('Datos actualizados correctaente.');
				setFormData(initialFormState());
				getUserData();
			})
			.catch((err) => {
				toast.error(err.code);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	return (
		<div className='profile-update'>
			<Form
				onSubmit={onSubmit}
				onChange={onChange}
				className='register-user__form'
			>
				<Form.Field>
					<Input
						type='text'
						name='name'
						value={formData.name}
						placeholder='Nombre(s)'
						icon='user'
					/>
				</Form.Field>
				<Form.Field>
					<Input type='text' name='lname' placeholder='Apellidos' icon='user' />
				</Form.Field>
				<Form.Field>
					<Input
						type='text'
						name='user'
						value={formData.user}
						placeholder='Usuario'
						icon='user'
					/>
				</Form.Field>
				<Form.Field>
					<Input
						type='text'
						name='phone'
						value={formData.phone}
						placeholder='Teléfono'
						icon='phone'
					/>
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						content='Actualziar información'
					/>
				</Form.Field>
			</Form>
		</div>
	);
}

function initialFormState() {
	return {
		name: '',
		lname: '',
		phone: '',
		user: '',
	};
}
