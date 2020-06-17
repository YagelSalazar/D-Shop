import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import firebase from '../../utils/Firebase';
import ProfilePicture from '../../components/Users/ProfilePicture';
import UpdateProfileForm from '../../components/Users/UpdateProfileForm/UpdateProfileForm';
import UpdatePasswordForm from '../../components/Users/UpdateProfileForm/UpdatePasswordForm';

import './Profile.scss';
const profileImg = require('../../assets/img/admin.png');

export default function Profile(props) {
	const db = firebase.firestore(firebase);
	const { user } = props;

	const [userInfo, setUserInfo] = useState(initialInfoUserState());

	useEffect(() => {
		getUserData();
	});

	const getUserData = () => {
		db
			.collection('Employees')
			.doc(user.email)
			.get()
			.then((resp) => {
				setUserInfo({
					name: resp.data().name,
					lname: resp.data().lName,
					phone: resp.data().phone,
					user: resp.data().user,
					email: resp.data().email,
					rol: resp.data().rol,
					permissionStock: resp.data().permissionStock,
					permissionProducts: resp.data().permissionProducts,
					permissionSales: resp.data().permissionSales,
					permissionCustomer: resp.data().permissionCustomer,
				});
			})
			.catch((err) => {
				console.log(err.code);
			});
	};
	return (
		<>
			<div className='general-grid'>
				<Grid>
					<Grid.Row className='general-grid__title'>
						<img src={profileImg} alt='my profile' />
						<h1>Perfil</h1>
					</Grid.Row>
					<Grid.Row className='general-grid__content'>
						<Grid.Column width={6} className='general-left'>
							<ProfilePicture user={userInfo} />
						</Grid.Column>
						<Grid.Column width={10} className='general-right'>
							<UpdateProfileForm user={userInfo} getUserData={getUserData} />
							<UpdatePasswordForm user={userInfo} getUserData={getUserData} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		</>
	);
}

function initialInfoUserState() {
	return {
		name: '',
		lname: '',
		phone: '',
		user: '',
		email: '',
		password: '',
		rol: '',
		permissionStock: false,
		permissionProducts: false,
		permissionSales: false,
		permissionCustomer: false,
	};
}
