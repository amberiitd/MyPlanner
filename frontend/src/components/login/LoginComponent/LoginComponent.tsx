import React, { Component, FC } from 'react';
import './LoginComponent.css';
import TextInput from '../../input/TextInput/TextInput'
import Button from '../../Button/Button'
import LoginButton from '../LoginButton/LoginButton'
import LinkGroup, { SimpleLink } from '../../LinkGroup/LinkGroup';
import ButtonEdit from '../../input/ButtonEdit/ButtonEdit';
import PasswordInput from '../../input/PasswordInput/PasswordInput';
import { googleLoginConfig } from '../buttonConfig';
import { configure } from '@testing-library/react';

interface LoginComponentProps {}
export interface AuthServer{
    id?: string;
    label: string;
    bsIcon: string;
    extraClasses?: string;
    configure: ()=> void;
}
interface LoginComponentState{
    authServers: AuthServer[];
    verificationStatus: 'init'| 'logged-out' | 'email-not-verified' | 'email-verified' | 'logged-in';
    emailInput: string;
    passwordInput: string;
}
export default class LoginComponent extends Component<LoginComponentProps, LoginComponentState>{

    constructor(props: LoginComponentProps){
        super(props);
        this.state = {
            authServers: [
                googleLoginConfig,
                {
                    label: "Facebook",
                    bsIcon: 'facebook',
                    configure: ()=> {}
                },
                {
                    label: "Github",
                    bsIcon: 'github',
                    configure: ()=> {}
                },
            ],
            verificationStatus: 'init',
            emailInput: '',
            passwordInput: '',
        };
    }
    loginActionLabel: {[key: string]: string} = {
        'init': 'Continue',
        'email-verified': 'Sign In',
        'email-not-verified': 'Sign Up',

    }
    footerLinks: SimpleLink[] = [
        {
            label: "Can't login",
            to: "/myp/page-not-found"
        },
        {
            label: "Sign up for an account",
            to: "/myp/page-not-found"
        }
    ]

    public handleClick(event: any): void{
        console.log(`opening ${event.serverName}`);
    }

    public handleLoginAction(event?: any){
        if (this.state.verificationStatus === 'init')
            this.setState({...this.state, verificationStatus: 'email-verified', passwordInput: ''})
        
    }

    public signIn(){

    }

    render(): React.ReactNode {
        const yMargin = 'my-3';
        return (
            <div className ="card-big shadow-sm border position-relative">
                <div className ="text-center h6">
                    Login To MyPlanner
                </div>
                <div className={yMargin} hidden={this.state.verificationStatus !== 'email-verified'}>
                    <ButtonEdit 
                        label={this.state.emailInput}
                        handleClick= {((event?: any)=>{
                            this.setState({...this.state, verificationStatus: 'init'})
                        }).bind(this)}
                    />
                </div>
                <div className={yMargin} 
                    hidden={
                        this.state.verificationStatus !== 'init'
                    }
                >
                    <TextInput 
                        label='Email'
                        hideLabel={true}
                        value={this.state.emailInput}
                        placeholder='Enter Email'
                        handleChange= {((value: string)=>{
                            this.setState({...this.state, emailInput: value})
                        }).bind(this)}
                    />
                </div>
                <div className={yMargin} hidden={this.state.verificationStatus !== 'email-verified'}>
                    <PasswordInput 
                        value={this.state.passwordInput}
                        handleChange= {((value: string)=>{
                            this.setState({...this.state, passwordInput: value})
                        }).bind(this)}
                        
                    />
                </div>
                <div className={yMargin}>
                    <Button
                        label={this.loginActionLabel[this.state.verificationStatus]}
                        handleClick= {this.handleLoginAction.bind(this)}
                    />
                </div>
                
                <div className={`text-center text-secondary fw-normal  ${yMargin}`}>
                    OR
                </div>
                {
                    this.state.authServers.map( (item, index) => (
                        <div className={yMargin} key = {index}>
                            <LoginButton
                                {...item}
                            />
                        </div>
                        
                    ))
                }

                <div className='login-comp-foot position-absolute'>
                    <hr/>
                    <LinkGroup links={this.footerLinks}/>
                </div>
                
            </div>
        )
    }
}
