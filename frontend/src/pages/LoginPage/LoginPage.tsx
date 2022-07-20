import React, { FC } from 'react';
import './LoginPage.css';
import LoginComponent from '../../components/login/LoginComponent/LoginComponent';
import LinkGroup, { SimpleLink } from '../../components/LinkGroup/LinkGroup';

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = (props: LoginPageProps) => {
    const pageLinks: SimpleLink[] = [
        {
            label: 'Privacy Policy',
            to: "/myp/page-not-found"
        },
        {
            label: 'User Notice',
            to: "/myp/page-not-found"
        }
    ]
    return (
        <div className="container mt-5" data-testid="LoginPage">
            <div className='d-flex justify-content-center align-items-center mb-5'>
                <img className="logo" src={process.env.PUBLIC_URL + '/logo2.png'} />
                <div className='h2 ms-3'>MyPlanner</div>
            </div>
            <div className='d-flex justify-content-center '>
                <LoginComponent/>
            </div>
            
            <div className='mt-4'>
                <LinkGroup links={pageLinks}/>
            </div>
        </div>
        
    );
}

export default LoginPage;
