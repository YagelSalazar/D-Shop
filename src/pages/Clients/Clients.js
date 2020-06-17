import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { map } from 'lodash';
import ClientForm from '../../components/Forms/ClientForm';
import ListviewContainer from '../../components/ListView/ListviewContainer';
import firebase from '../../utils/Firebase';
import './Clients.scss';
const usersImg = require('../../assets/img/clients.png');

const db = firebase.firestore(firebase);

export default function Users() {
	const [clients, setClients] = useState([]);

	useEffect(() => {
		getAllClients();
	}, []);

	const getAllClients = () => {
		db
			.collection('Clients')
			.get()
			.then((res) => {
				const arrayClients = [];
				map(res?.docs, (client) => {
					const data = client.data();
					data.id = client.id;
					arrayClients.push(data);
				});
				setClients(arrayClients);
			});
	};

	return (
		<>
			<div className='general-grid'>
				<Grid>
					<Grid.Row className='general-grid__title'>
						<img src={usersImg} alt='users' />
						<h1>Clientes</h1>
					</Grid.Row>
					<Grid.Row className='general-grid__content'>
						<Grid.Column width={6} className='users-left'>
							<ClientForm updateData={getAllClients} />
						</Grid.Column>
						<Grid.Column width={10} className='users-right'>
							<ListviewContainer
								data={clients}
								searchText='Buscar cliente'
								type='Clients'
								updateData={getAllClients}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		</>
	);
}
