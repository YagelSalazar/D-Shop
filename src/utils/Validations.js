export function validateEmail(email) {
	// eslint-disable-next-line no-useless-escape
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export function validateUser(user) {
	const checkUser = /^(?=\w*\d)(?=\w*[a-z])\S{8,16}$/;
	return checkUser.test(String(user).toLowerCase());
}

export function validatePassword(pass) {
	const checkPass = /^(?=\w*\d)(?=\w*[a-z])\S{8,16}$/;
	return checkPass.test(String(pass).toLowerCase());
}
