import React, { FC } from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  handleClick: () => void;
}

const Button: FC<ButtonProps> = (props) => (
  <div className="" data-testid="Button">
    <button className="btn btn-thm form-control" style={{backgroundColor: 'coral'}}
      onClick={()=> props.handleClick()}
    >
      {props.label}
    </button>
  </div>
);

export default Button;
