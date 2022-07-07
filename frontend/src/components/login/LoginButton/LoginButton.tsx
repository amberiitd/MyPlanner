/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { FC } from 'react';
import './LoginButton.module.css';

interface LoginButtonProps {
    label: string;
    handleClick: (event?: any) => void;
}

const LoginButton: FC<LoginButtonProps> = (props) => {
    return (
        <div className="btn login-button" onClick={() => props.handleClick({serverName: props.label})}>
            {props.label}
        </div>
    )
}

export default LoginButton;
