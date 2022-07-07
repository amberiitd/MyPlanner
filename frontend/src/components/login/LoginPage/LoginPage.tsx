import React, { FC } from 'react';
import './LoginPage.module.css';
import LoginComponent from '../LoginComponent/LoginComponent.tsx';

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = (props: LoginPageProps) => (
    <div className="container" data-testid="LoginPage">
        <LoginComponent></LoginComponent>
    </div>
);

export default LoginPage;
