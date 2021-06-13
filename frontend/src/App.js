import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './main.css';
import HomePage from './Pages/HomePage/HomePage';

function App() {
	return (
		<React.Fragment>
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={HomePage} />
				</Switch>
			</BrowserRouter>
		</React.Fragment>
	);
}

export default App;
