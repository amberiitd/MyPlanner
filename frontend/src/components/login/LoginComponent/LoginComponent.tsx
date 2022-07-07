import React, { Component, FC } from 'react';
import './LoginComponent.module.css';
import TextInput from '../../TextInput/TextInput.tsx'
import Button from '../../Button/Button.tsx'
import LoginButton from '../LoginButton/LoginButton.tsx'

interface LoginComponentProps {}
interface LoginComponentState{
    authServers: {
        label: string;
    }[];
}
export default class LoginComponent extends Component<LoginComponentProps, LoginComponentState>{

    constructor(props: LoginComponentProps){
        super(props);
        this.state = {
            authServers: [
                {
                    label: "Google"
                },
                {
                    label: "Facebook"
                }
            ]
        };

        this.props
    }

    public handleClick(event: any): void{
        console.log(`opening ${event.serverName}`);
    }

    render(): React.ReactNode {
        return (
            <div className ="login-component shadow-sm">
                <div className ="text-center h4">
                    Login To MyPlanner
                </div>
                <TextInput></TextInput>
                <Button></Button>
                <div className="text-center">
                    OR
                </div>
                {
                    this.state.authServers.map( (item, index) => (
                        <LoginButton key = {index}
                            label={item.label}
                            handleClick={this.handleClick.bind(this)}
                        ></LoginButton>
                    ))
                }
                
            </div>
        )
    }
}
