import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import firebase from '../../utils/Firebase';
import Card from '../../components/Menu/Card';
import './Menu.scss';

const stockImg = require('../../assets/img/stock.png');
const productsImg = require('../../assets/img/products.png');
const profileImg = require('../../assets/img/admin.png');
const clientsImg = require('../../assets/img/clients.png');
const salesImg = require('../../assets/img/sales.png');
const usersImg = require('../../assets/img/users.png');

export default function Menu(props) {
	const db = firebase.firestore(firebase);

	const { user, isAdmin } = props;
	const [permissions, setPermissions] = useState(initialPermissionsState());

	useEffect(() => {
		getUserPermissions();
	});

	const getUserPermissions = () => {
		db
			.collection('Employees')
			.doc(user.email)
			.get()
			.then((resp) => {
				setPermissions({
					Stock: resp.data().permissionStock,
					Products: resp.data().permissionProducts,
					Sales: resp.data().permissionSales,
					Customer: resp.data().permissionCustomer,
				});
			})
			.catch((err) => {
				console.log(err.code);
			});
	};

	return (
		<div className='grid-menu'>
			<Grid>
				<Grid.Row>
					{(permissions.Stock || isAdmin) && (
						<Grid.Column width={4}>
							<Card image={stockImg} title='Stock' to='/stock' />
						</Grid.Column>
					)}
					{(permissions.Products || isAdmin) && (
						<Grid.Column width={4}>
							<Card image={productsImg} title='Productos' to='/products' />
						</Grid.Column>
					)}
					{(permissions.Customer || isAdmin) && (
						<Grid.Column width={4}>
							<Card image={clientsImg} title='Clientes' to='/clients' />
						</Grid.Column>
					)}
				</Grid.Row>
				<Grid.Row>
					{(permissions.Sales || isAdmin) && (
						<Grid.Column width={4}>
							<Card image={salesImg} title='Ventas' to='/sales' />
						</Grid.Column>
					)}
					<Grid.Column width={4}>
						<Card image={profileImg} title='Perfil' to='/profile' />
					</Grid.Column>
					{isAdmin && (
						<Grid.Column width={4}>
							<Card image={usersImg} title='Empleados' to='/users' />
						</Grid.Column>
					)}
				</Grid.Row>
			</Grid>
		</div>
	);
}

function initialPermissionsState() {
	return {
		Stock: false,
		Products: false,
		Sales: false,
		Customer: false,
	};
}
