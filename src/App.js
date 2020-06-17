import React, { useState } from 'react';
import firebase from './utils/Firebase';
import 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';

import Auth from './pages/Auth';

function App() {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	firebase.auth().onAuthStateChanged((currentUser) => {
		if (!currentUser) {
			firebase.auth().signOut();
			setUser(null);
		} else {
			setUser(currentUser);
		}
		setIsLoading(false);
	});

	if (isLoading) {
		return null;
	}

	// return !user ? <Auth /> : userLogged();
	return (
		<>
			{!user ? <Auth /> : <HomeLayout user={user} />}
			<ToastContainer
				position='top-center'
				autoClose={5000}
				hideProgressBar
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnVisivilityChange
				draggable
				pauseOnHover={true}
			/>
		</>
	);
}

export default App;
