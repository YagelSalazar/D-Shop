import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { map } from 'lodash';

import ProductForm from '../../components/Forms/ProductForm';
import CardviewContainer from '../../components/ListView/CardviewContainer';
import firebase from '../../utils/Firebase';
const productsImg = require('../../assets/img/products.png');

const db = firebase.firestore(firebase);

export default function Users() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		getAllProducts();
	}, []);

	const getAllProducts = () => {
		db
			.collection('Products')
			.get()
			.then((res) => {
				const arrayProducts = [];
				map(res?.docs, (product) => {
					const data = product.data();
					data.id = product.id;
					arrayProducts.push(data);
				});
				setProducts(arrayProducts);
			});
	};

	return (
		<>
			<div className='general-grid'>
				<Grid>
					<Grid.Row className='general-grid__title'>
						<img src={productsImg} alt='products' />
						<h1>Productos</h1>
					</Grid.Row>
					<Grid.Row className='general-grid__content'>
						<Grid.Column width={6} className='users-left'>
							<ProductForm updateData={getAllProducts} />
						</Grid.Column>
						<Grid.Column width={10} className='users-right'>
							<CardviewContainer
								data={products}
								searchText='Buscar producto'
								type='Products'
								updateData={getAllProducts}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		</>
	);
}
