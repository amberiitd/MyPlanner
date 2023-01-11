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
  tooltip?: string;
  extraClasses?: string;
  dynamicLabel?: boolean;
  handleClick: () => void;
}

const Button: FC<ButtonProps> = (props) => (
    <button 
        className={`d-flex flex-nowrap app-button hover-button w-100 rounded-1 ${props.extraClasses?? 'btn-as-thm py-1 px-1'} ${props.disabled? 'btn-as-muted': ''}`} 
        unselectable='on' 
        onMouseDown={(e) => {e.preventDefault(); if (!props.disabled)props.handleClick();}} 
        tabIndex={-1} 
        disabled={props.disabled}
        style={{cursor: props.disabled? 'not-allowed': 'pointer'}}
        title={props.tooltip}
    >
    <div className='' hidden={!!props.hideIcon || !props.leftBsIcon}>
        <i className={`bi bi-${props.leftBsIcon}`}></i>
    </div>
    <div className={`btn-label mx-2 ${props.dynamicLabel? 'd-none d-md-block': ''}`} hidden={!!props.hideLabel}>{props.label}</div>
    <div className='me-1 ms-auto' hidden={!!props.hideIcon || !props.rightBsIcon}>
        <i className={`bi bi-${props.rightBsIcon}`}></i>
    </div>
  </button>
);

export default Button;
