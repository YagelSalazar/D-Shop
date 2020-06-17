import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { isUserAdmin } from '../../utils/Api';

import firebase from '../../utils/Firebase';
import './HomeLayout.scss';
import Routes from '../../routes/Routes';
import TopBar from '../../components/Menu/TopBar';

// Styles
import { Button } from 'semantic-ui-react';

const logo = require('../../assets/img/ice-cream.png');

export const HomeLayout = (props) => {
	const { user } = props;
	const [isAdmin, setIsAdmin] = useState(false);

	const logOut = () => {
		firebase.auth().signOut();
	};

	useEffect(() => {
		isUserAdmin(user.uid).then((res) => {
			setIsAdmin(res);
		});
	}, [user]);

	return (
		<Router>
			<Grid className='home-layout'>
				<Grid.Row>
					<Grid.Column className='side-menu' width={3}>
						<div className='side-menu__head'>
							<div className='side-menu__head-logo'>
								<img src={logo} alt='ice cream' />
							</div>
							<h1>Paleteria Chuchin</h1>
						</div>
						<div className='side-menu__content'>
							<Link to='/' className='side-menu__content-btn'>
								Menu
							</Link>
							<Link to='/sale' className='side-menu__content-btn'>
								Nueva venta
							</Link>
							<Link to='/settings' className='side-menu__content-btn'>
								Configuración
							</Link>
						</div>
						<div className='side-menu__foot'>
							<Button
								type='button'
								onClick={logOut}
								className='btn-primary'
								content='Cerrar sesión'
							/>
						</div>
					</Grid.Column>
					<Grid.Column className='content-menu' width={13}>
						<Grid.Row>
							<TopBar user={user} />
						</Grid.Row>
						<Grid.Row className='bottom-menu'>
							<Routes user={user} isAdmin={isAdmin} />
						</Grid.Row>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Router>
	);
};

export default HomeLayout;
