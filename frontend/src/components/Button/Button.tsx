import React, { FC } from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  bsIcon?: string;
  hideLabel?: boolean;
  hideIcon?: boolean;
  disabled?: boolean;
  aslink?: boolean;
  extraClasses?: string
  handleClick: () => void;
}

const Button: FC<ButtonProps> = (props) => (
  <div className={`p-1 ${props.hideLabel? '': 'px-3'} d-inline-flex flex-nowrap button rounded-1 ${props.disabled? 'btn-as-muted': ''} ${props.extraClasses?? 'btn-as-thm'}`} onClick={() => {props.handleClick()}}>
    <div hidden={!!props.hideLabel}>{props.label}</div>
    <div className='mx-1' hidden={!!props.hideIcon || !props.bsIcon}>
        <i className={`bi bi-${props.bsIcon}`}></i>
    </div>
  </div>
);

export default Button;
