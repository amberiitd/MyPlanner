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
    verificationStatus: 'init'| 'logged-out' | 'email-not-verified' | 'email-verified' | 'logged-in' | 'user-exists';
    emailInput: string;
    passwordInput: string;
    fullNameInput?: string;
    formError?: {email?: string; password?: string; fullName?: string};
    stageError?: JSX.Element;
    currentUser?: any;
}
class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState>{
    private authServerList = [
        {
            id: 'google-login',
            label: "Google",
            bsIcon: "google",
            extraClasses: 'g-signin2',
            configure: ()=> {
                // const handleCredentialResponse = (response: any) => {
                //     fetch('https://oauth2.googleapis.com/token?'+ new URLSearchParams({
                //         code: response.code,
                //         client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
                //         client_secret: "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",
                //         grant_type: "authorization_code",
                //         redirect_uri: "http://localhost:3000"
                //     }), { method: 'POST'})
                //     .then(response => response.json())
                //     .then(data => console.log(data));
                // };
                // /* global google */
                // const client = google.accounts.oauth2.initCodeClient({
                //     client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                //     scope: 'email profile ',
                //     callback: handleCredentialResponse
                // });
                // document.getElementById('google-login')?.addEventListener('click', ()=> {
                //     client.requestCode()
                // });
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

    private loginActionLabel: {[key: string]: {btnLabel: string; action: () => void;}} = {
        'init': {
            btnLabel: 'Continue',
            action: () => {
                this.setState({...this.state, verificationStatus: 'email-verified'});
                this.props.setSearchParam({
                    credstage: 'email-verified',
                    email: this.props.searchParam.get('email'),
                    redirect_to: this.props.searchParam.get('redirect_to') || ''
                });
            }
        },
        'email-verified': {
            btnLabel: 'Sign In',
            action: ()=> {
                const passverified = this.state.passwordInput && this.state.passwordInput.length > 8;
                if (!passverified){
                    const passerror = 'Invalid password';
                    this.setState({...this.state, formError: {password: passerror, email: undefined}});
                    return
                }
                Auth.signIn(this.state.emailInput, this.state.passwordInput)
                .then(res => {
                    console.log(res);
                    const redirectTo = this.props.searchParam.get('redirect_to');
                    if (redirectTo){
                        window.location.href = atob(redirectTo);
                    }else{
                        this.props.navigate('/myp/your-work');
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        ...this.state, 
                        verificationStatus: 'email-not-verified',
                        stageError: <div className='text-danger f-90'>Wrong user credential! Please sign up</div>
                    });
                    this.props.setSearchParam({
                        credstage: 'email-not-verified',
                        email: this.props.searchParam.get('email'),
                        redirect_to: this.props.searchParam.get('redirect_to') || ''
                    })
                    this.setState({...this.state, formError: {password: undefined, email: undefined}});
                });
            }
        },
        'email-not-verified': {
            btnLabel: 'Sign Up',
            action: ()=>{
                const passverified = this.state.passwordInput && this.state.passwordInput.length > 8;
                const nameverfied = this.state.fullNameInput && this.state.fullNameInput.length > 3;
                if (passverified && nameverfied){
                    this.setState({...this.state, formError: {...this.state.formError, fullName: undefined, password: undefined}});
                    Auth.signUp({
                        username: this.state.emailInput, 
                        password: this.state.passwordInput, 
                        attributes:{
                            'email': this.state.emailInput,
                            'custom:fullName': this.state.fullNameInput
                        }
                    })
                    .then(res => {
                        console.log(res);
                        this.setState({...this.state, verificationStatus: 'init', stageError: undefined});
                        this.props.setSearchParam({
                            credstage: 'init',
                            email: this.props.searchParam.get('email'),
                            redirect_to: this.props.searchParam.get('redirect_to') || ''
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        this.setState({...this.state, stageError: <div className='text-primary f-90'>User already exists with email: <strong>{this.state.emailInput}</strong></div>});
                    });
                }else{
                    const passerror = 'Invalid password';
                    const nameerror = 'Name literal mus be of length > 3.';
                    this.setState({...this.state, formError: {...this.state.formError, fullName: nameerror, password: passerror}})
                }
            }
        },

    };

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
    };

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
        const email = this.props.searchParam.get('email');
        const redirectTo = this.props.searchParam.get('redirect_to');
        Auth.currentAuthenticatedUser()
        .then(res => {
            if (!isEmpty(email) && email !== res.attributes.email){
                this.setState({...this.state, currentUser: res});
            }
            else if( !isEmpty(res) && !isEmpty(res.username) ){
                if (redirectTo)
                    window.location.href = atob(redirectTo)
                else this.props.navigate('/myp/home')
            }
        })
        .catch(err => console.log(err))

        this.setState({
            ...this.state, 
            emailInput: this.props.searchParam.get('email') || this.state.emailInput,
            verificationStatus: this.props.searchParam.get('credstage') || this.state.verificationStatus || 'init'
        })
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

    private verifyEmailInput(): boolean{
        const emailVerified = toLower(this.state.emailInput).match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        
        return !!emailVerified
    }

    public handleLoginAction(event?: any){
        const emailverfied = this.verifyEmailInput();
        if (emailverfied){
            (this.loginActionLabel[this.state.verificationStatus] || this.loginActionLabel['init']).action();
        }else{
            const emailerror = emailverfied? undefined: 'Invalid email input!';

            this.setState({...this.state, formError: {password: undefined, email: emailerror}});
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
                {
                    this.state.stageError &&
                    <div className='text-primary f-80 text-center'>
                        {this.state.stageError}
                    </div>
                }
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
                                credstage: this.props.searchParam.get('credstage') || this.state.verificationStatus,
                                redirect_to: this.props.searchParam.get('redirect_to') || ''
                            })
                        }).bind(this)}
                    />
                    {
                        this.state.formError?.email &&
                        <div className='text-danger f-80 px-1'>{this.state.formError?.email}</div>
                    }
                </div>
                <div className={yMargin} 
                    hidden={this.state.verificationStatus !== 'email-not-verified'}
                >
                    <TextInput 
                        label='Full Name'
                        hideLabel={true}
                        value={this.state.fullNameInput || ''}
                        placeholder='Enter Full Name'
                        handleChange= {((value: string)=>{
                            this.setState({...this.state, fullNameInput: value});
                        }).bind(this)}
                    />
                    {
                        this.state.formError?.fullName &&
                        <div className='text-danger f-80 px-1'>{this.state.formError?.fullName}</div>
                    }
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
                    {
                        this.state.formError?.password &&
                        <div className='text-danger f-80 px-1'>{this.state.formError?.password}</div>
                    }
                </div>
                <div className={yMargin}>
                    <Button
                        label={(this.loginActionLabel[this.state.verificationStatus] || this.loginActionLabel['init']).btnLabel}
                        handleClick= {this.handleLoginAction.bind(this)}
                        extraClasses='btn-as-thm w-100 px-3 py-1'
                    />
                </div>
                
                <div className={`text-center text-secondary fw-normal  ${yMargin}`}>
                    OR
                </div>
                {
                    this.state.currentUser &&
                    <div className={yMargin}>
                        <LoginButton
                            label={`Continue as: ${this.state.currentUser.username}`}
                            onClick={()=>{
                                this.props.navigate('/myp/home');
                            }}
                        />
                    </div>
                }
                {
                    this.state.authServers.map( (item, index) => (
                        <div className={yMargin} key = {index}>
                            <LoginButton
                                {...item}
                                label={`Continue with ${item.label}`}
                            />
                        </div>
                        
                    ))
                }

                <div className='login-comp-foot position-absolute'>
                    <hr/>
                    <LinkGroup 
                        links={this.footerLinks[this.state.verificationStatus] || this.footerLinks['init']}
                        handleClick={this.handleLinkClick.bind(this)}
                    />
                </div>
                
            </div>
        )
    }
}

export default LoginComponent
