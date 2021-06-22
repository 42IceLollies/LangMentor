import React, { Component } from 'react';
import { BrowserRouter, Link, Route,} from 'react-router-dom';



      

class SignUpButton extends Component {
        
    render() { 
        return (
            <button
                className = "btn btn-primary m-3"
            >  
                     <Link to = {"/UserAuthentication"}>
                     Sign Up
                    </Link>
            </button>

          );
    }
}
 
export default SignUpButton;