import React, { FC } from 'react';
import './ButtonEdit.css';

interface ButtonEditProps {
  label: string;
  handleClick: (event?: any) => void
}

const ButtonEdit: FC<ButtonEditProps> = (props) => (
  <div className="" data-testid="TextInput">
    <button className="btn form-control btn-light d-flex justify-content-between" placeholder='Enter email' onClick={(event) => props.handleClick(event)}>
      <div>
        {props.label}
      </div>
      <div><i className="bi bi-pencil-fill"></i></div>
      
    </button>
  </div>
);

export default ButtonEdit;
