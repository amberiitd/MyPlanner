import React, { FC } from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  rightBsIcon?: string;
  leftBsIcon?: string;
  hideLabel?: boolean;
  hideIcon?: boolean;
  disabled?: boolean;
  aslink?: boolean;
  extraClasses?: string;
  handleClick: () => void;
}

const Button: FC<ButtonProps> = (props) => (
  <div className={`d-flex flex-nowrap justify-content-center button rounded-1 ${props.extraClasses?? 'btn-as-thm px-3 py-1'} ${props.disabled? 'btn-as-muted': ''} `} onClick={() => {props.handleClick()}}>
    <div className='me-2' hidden={!!props.hideIcon || !props.leftBsIcon}>
        <i className={`bi bi-${props.leftBsIcon}`}></i>
    </div>
    <div hidden={!!props.hideLabel}>{props.label}</div>
    <div className='mx-1' hidden={!!props.hideIcon || !props.rightBsIcon}>
        <i className={`bi bi-${props.rightBsIcon}`}></i>
    </div>
  </div>
);

export default Button;
