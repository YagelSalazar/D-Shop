import React, { useState, useCallback } from 'react';
import { Image } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import noImage from '../../assets/img/picture.png';

import './InputFile.scss';

export default function InputFile(props) {
	const { name } = props;

	// const [preview, setPreview] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	console.log(imageUrl);
	const onDrop = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];
		setImageUrl(file);
		// setPreview(URL.createObjectURL(file));
	});

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/jpeg, image/png',
		noKeyboard: true,
		onDrop,
	});

	return (
		<div className='upload-image'>
			<div className='upload-image__content'>
				<div
					className='preview'
					{...getRootProps()}
					// style={{ backgroundImage: `url('${preview})` }}
				/>
				<input name={name} {...getInputProps()} />
				<Image src={noImage} />
				{/* {preview && <Image src={noImage} />} */}
			</div>
		</div>
	);
}
