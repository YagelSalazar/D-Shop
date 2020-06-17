import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import './TopBar.scss';
const noImg = require('../../../assets/img/admin.png');

function TopBar(props) {
	const { user, history } = props;

	const goBack = () => {
		history.goBack();
	};

	return (
		<div className='top-bar'>
			<button type='button' onClick={goBack} className='top-bar__btn-back'>
				<Icon name='angle left' />
			</button>
			<Link to='/profile' className='top-bar__user'>
				<span>{user.email}</span>
				<div className='top-bar__user-avatar'>
					<img src={noImg} alt='user avatar' />
				</div>
			</Link>
		</div>
	);
}

export default withRouter(TopBar);
