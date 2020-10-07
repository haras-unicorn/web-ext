import React from 'react';

import LoginForm from '../components/forms/LoginForm';

import { AuthenticatedRoutes } from '../components/Router';


const Login: React.FC = () =>
        <div className="ion-padding">
            <LoginForm redirectOnLogin={AuthenticatedRoutes.HELB.home.route}/>
        </div>;


export default Login;
