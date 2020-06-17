import React, { useState } from 'react';
import './Auth.scss';

import LoginForm from '../../components/Auth/LoginForm';
import ForgotForm from '../../components/Auth/ForgotForm';

export default function Auth() {
	const [selectedForm, setSelectedForm] = useState(null);

	const handleForm = () => {
		switch (selectedForm) {
			case 'login':
				return <LoginForm setSelectedForm={setSelectedForm} />;
			case 'forgot':
				return <ForgotForm setSelectedForm={setSelectedForm} />;
			default:
				return <LoginForm setSelectedForm={setSelectedForm} />;
		}
	};

	return <div className='auth'>{handleForm()}</div>;
}
