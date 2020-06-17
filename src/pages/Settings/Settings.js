import React, { useState } from 'react';
import { Grid, Accordion, Icon } from 'semantic-ui-react';
import CategoryTable from '../../components/Tables/CategoryTable';

import './Settings.scss';
import settingsImg from '../../assets/img/settings.png';

export default function Settings(props) {
	const [accordion, setAccordion] = useState(null);
	const [setingsCategories, setSettingsCategories] = useState(null);

	const handleClick = (index) => {
		const newIndex = accordion === index ? -1 : index;
		if (newIndex === 0) {
			!setingsCategories && setSettingsCategories(<CategoryTable />);
		}
		setAccordion(newIndex);
	};

	return (
		<>
			<div className='settings-grid'>
				<Grid>
					<Grid.Row className='settings-grid__title'>
						<img src={settingsImg} alt='settings' />
						<h1>Configuración</h1>
					</Grid.Row>
					<Grid.Row className='settings-grid__content'>
						<Accordion fluid styled>
							<Accordion.Title
								active={accordion === 0 ? true : false}
								index={0}
								onClick={() => handleClick(0)}
							>
								<Icon name='dropdown' />
								Categorías
							</Accordion.Title>
							<Accordion.Content active={accordion === 0 ? true : false}>
								{setingsCategories}
							</Accordion.Content>

							<Accordion.Title
								active={accordion === 1 ? true : false}
								index={1}
								onClick={() => handleClick(1)}
							>
								<Icon name='dropdown' />
								Más configuraciones
							</Accordion.Title>
							<Accordion.Content active={accordion === 1 ? true : false}>
								<p>No hay más configuraciones.</p>
							</Accordion.Content>
						</Accordion>
					</Grid.Row>
				</Grid>
			</div>
		</>
	);
}
