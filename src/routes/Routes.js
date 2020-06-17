import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Pages
import Menu from '../pages/Menu';
import Users from '../pages/Users';
import Profile from '../pages/Profile';
import Clients from '../pages/Clients';
import Products from '../pages/Products';
import Settings from '../pages/Settings';

export default function Routes(props) {
	const { user, isAdmin } = props;

	return (
		<Switch>
			<Route path='/' exact>
				<Menu user={user} isAdmin={isAdmin} />
			</Route>
			<Route path='/profile' exact>
				<Profile user={user} isAdmin={isAdmin} />
			</Route>
			<Route path='/stock' exact>
				<h1>stock</h1>
			</Route>
			<Route path='/products' exact>
				<Products user={user} isAdmin={isAdmin} />
			</Route>
			<Route path='/clients' exact>
				<Clients user={user} isAdmin={isAdmin} />
			</Route>
			<Route path='/sales' exact>
				<h1>Sales</h1>
			</Route>
			{isAdmin && <Route path='/users' exact component={Users} />}
			{isAdmin && <Route path='/settings' exact component={Settings} />}
		</Switch>
	);
}
