import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default function UserAuthentication(props) {

	return (
		<React.Fragment>
			<h1>Create an Account!</h1>
			<Link to={"/HomePage"}>
				Home
			</Link>
		</React.Fragment>
	);
}