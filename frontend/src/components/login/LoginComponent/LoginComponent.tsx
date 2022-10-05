import React, { Component, FC } from 'react';
import './LoginComponent.css';
import TextInput from '../../input/TextInput/TextInput'
import Button from '../../Button/Button'
import LoginButton from '../LoginButton/LoginButton'
import LinkGroup, { SimpleLink } from '../../LinkGroup/LinkGroup';
import ButtonEdit from '../../input/ButtonEdit/ButtonEdit';
import PasswordInput from '../../input/PasswordInput/PasswordInput';
import { Auth } from 'aws-amplify';
import { isEmpty, toLower } from 'lodash';

interface LoginComponentProps {
    navigate: any,
    searchParam: any,
    setSearchParam: (param: any) => void
}
export interface AuthServer{
    id?: string;
    label: string;
    bsIcon: string;
    extraClasses?: string;
    configure?: ()=> void;
}
interface LoginComponentState{
    authServers: AuthServer[];
    verificationStatus: string | 'init'| 'logged-out' | 'email-not-verified' | 'email-verified' | 'logged-in';
    emailInput: string;
    passwordInput: string;
}
class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState>{
    private authServerList = [
        {
            id: 'google-login',
            label: "Google",
            bsIcon: "google",
            extraClasses: 'g-signin2',
            configure: ()=> {
                const handleCredentialResponse = (response: any) => {
                    fetch('https://oauth2.googleapis.com/token?'+ new URLSearchParams({
                        code: response.code,
                        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
                        client_secret: "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",
                        grant_type: "authorization_code",
                        redirect_uri: "http://localhost:3000"
                    }), { method: 'POST'})
                    .then(response => response.json())
                    .then(data => console.log(data));
                };
                /* global google */
                const client = google.accounts.oauth2.initCodeClient({
                    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                    scope: 'email profile ',
                    callback: handleCredentialResponse
                });
                document.getElementById('google-login')?.addEventListener('click', ()=> {
                    client.requestCode()
                });
            }
        },
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
    ];

    constructor(props: any){
        super(props);
        this.state= {
            authServers: this.authServerList,
            verificationStatus: 'init',
            emailInput: '',
            passwordInput: '',
        };
    }

    componentDidMount(){
        
        Auth.currentAuthenticatedUser()
        .then(res => {
            if( !isEmpty(res) && !isEmpty(res.username) ){
                this.props.navigate('/myp/home')
            }
        })
        .catch(err => console.log(err))
        this.setState({
            ...this.state, 
            emailInput: this.props.searchParam.get('email') || this.state.emailInput,
            verificationStatus: this.props.searchParam.get('credstage') || this.state.verificationStatus
        })
    }

    loginActionLabel: {[key: string]: string} = {
        'init': 'Continue',
        'email-verified': 'Sign In',
        'email-not-verified': 'Sign Up',

    }


    footerLinks: {[key: string]: SimpleLink[]} = {
        'init': [
            {
                label: "Can't login",
                value: 'cant-login',
                to: "/myp/page-not-found"
            },
            {
                label: "Sign up for an account",
                value: 'sign-up'
            }
        ],
        'email-verified':[
            {
                label: "Can't login",
                value: 'cant-login',
                to: "/myp/page-not-found"
            },
            {
                label: "Sign up for an account",
                value: 'sign-up',
            }
        ],
        'email-not-verified':[
            {
                label: "Sign in",
                value: 'sign-in'
            }
        ]
    }

    public handleClick(event: any): void{
        console.log(`opening ${event.serverName}`);
    }

    public handleLinkClick(value: any){
        var email = this.props.searchParam.get('email');
        email = email === 'null'? '': email
        if(value === 'sign-up'){
            this.props.navigate("/login?" + (new URLSearchParams({
                email: email,
                credstage: 'email-not-verified'
            })).toString())
        }
        if (value === 'sign-in'){
            this.props.navigate("/login?" + new URLSearchParams({
                email: email,
                credstage: 'init'
            }))
        }
    }

    private verifyInput(): boolean{
        const emailVerified = toLower(this.state.emailInput).match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        return !!emailVerified
    }

    public handleLoginAction(event?: any){

        if (this.state.verificationStatus === 'init' && this.verifyInput()){
            this.setState({...this.state, verificationStatus: 'email-verified', passwordInput: ''});
            this.props.setSearchParam({
                credstage: 'email-verified',
                email: this.props.searchParam.get('email')
            })
        }
        if (this.state.verificationStatus === 'email-verified' && this.verifyInput()){
            Auth.signIn(this.state.emailInput, this.state.passwordInput)
            .then(res => {
                console.log(res);
                this.props.navigate('/myp/your-work')
            })
            .catch(err => {
                this.setState({...this.state, verificationStatus: 'email-not-verified'});
                this.props.setSearchParam({
                    credstage: 'email-not-verified',
                    email: this.props.searchParam.get('email')
                })
            })
            ;
        }
        if (this.state.verificationStatus === 'email-not-verified' && this.verifyInput()){
            Auth.signUp({
                username: this.state.emailInput, 
                password: this.state.passwordInput, 
                attributes:{
                    'email': this.state.emailInput
                }
            })
            .then(res => console.log(res))
            .catch(err=>{
                console.log(err)
            })
        }
    }

    public signIn(res: any){
        console.log(res)
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
                        && this.state.verificationStatus !== 'email-not-verified'
                    }
                >
                    <TextInput 
                        label='Email'
                        hideLabel={true}
                        value={this.state.emailInput}
                        placeholder='Enter Email'
                        handleChange= {((value: string)=>{
                            this.setState({...this.state, emailInput: value});
                            this.props.setSearchParam({
                                email: value,
                                credstage: this.props.searchParam.get('credstage')
                            })
                        }).bind(this)}
                    />
                </div>
                <div className={yMargin} 
                    hidden={
                        this.state.verificationStatus === 'init'
                    }
                >
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
                        extraClasses='btn-as-thm w-100 px-3 py-1'
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
                    <LinkGroup 
                        links={this.footerLinks[this.state.verificationStatus]}
                        handleClick={this.handleLinkClick.bind(this)}
                    />
                </div>
                
            </div>
        )
    }
}

export default LoginComponent
