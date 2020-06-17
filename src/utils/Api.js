import firebaseApp from './Firebase';

import * as firebase from 'firebase';
const db = firebase.firestore(firebaseApp);

export async function isUserAdmin(uid) {
	const response = await db.collection('admins').doc(uid).get();

	return response.exists;
}

export const reathenticate = (password) => {
	const user = firebase.auth().currentUser;

	const credentials = firebase.auth.EmailAuthProvider.credential(
		user.email,
		password,
	);

	return user.reauthenticateWithCredential(credentials);
};

export async function getUserPermissions(email) {
	let userPermissions = {};
	await db
		.collection('Employees')
		.doc(email)
		.get()
		.then((resp) => {
			userPermissions = {
				Stock: resp.data().permissionStock,
				Products: resp.data().permissionProducts,
				Sales: resp.data().permissionSales,
				Customer: resp.data().permissionCustomer,
			};
		})
		.catch((err) => {
			console.log(err.code);
		});
	return userPermissions;
}

export const renameId = (string) => {
	return string
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
};
