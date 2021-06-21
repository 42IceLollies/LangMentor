import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpButton from '../../Components/SignUpBtn';



export default function HomePage(props) {
	return (
		<React.Fragment>
			<h1>Welcome!</h1>
			
			<SignUpButton>
			</SignUpButton>
		
		</React.Fragment>
	);
}
