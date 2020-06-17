import firebase from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyCtMdQbyYgfMCrt-JuE0fVYt35VGM0JyUw',
	authDomain: 'paleteria-chuchin.firebaseapp.com',
	databaseURL: 'https://paleteria-chuchin.firebaseio.com',
	projectId: 'paleteria-chuchin',
	storageBucket: 'paleteria-chuchin.appspot.com',
	messagingSenderId: '150800800623',
	appId: '1:150800800623:web:94dd7817460fbd667c269a',
};

export default firebase.initializeApp(firebaseConfig);
