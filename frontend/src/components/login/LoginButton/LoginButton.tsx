/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getModeForUsageLocation } from 'typescript';
import './LoginButton.css';

interface LoginButtonProps {
    id?: string;
    label: string;
    bsIcon: string;
    extraClasses?: string;
    extraProps?: any;
    configure?: ()=> void;
}
    
const LoginButton: FC<LoginButtonProps> = (props) => {
    
    useEffect(()=> {
        (props.configure || (() => {}))();
    }, []);

    return (
        <div {...(props.extraProps??{})} className={`${props.extraClasses?? ''} login-button d-block shadow-sm border`} id={props.id}>
            <button className='btn form-control text-secondary'>
                <i className={`bi bi-${props.bsIcon} float-start`}></i>
                Continue with {props.label}
            </button>

        </div>
    )
}

export default LoginButton;
