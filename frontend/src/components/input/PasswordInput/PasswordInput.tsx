import React, { FC, useState } from 'react';
import { isPropertySignature } from 'typescript';
import './PasswordInput.css';

interface PasswordInputProps {
  value: string;
  handleChange: (value: string)=> void;
}

const PasswordInput: FC<PasswordInputProps> = (props) => {
  const [inputType, setInputType] = useState('password');

  return (
    <div className="input-group" data-testid="PasswordInput">
      <input className="form-control" type= {inputType} placeholder='Enter password' value ={props.value} onChange={(e)=> props.handleChange(e.target.value)}/>
      <span className="input-group-text">
        <i className="bi bi-eye "  onClick={()=> {setInputType('text')}} hidden={inputType === 'text'}></i>
        <i className="bi bi-eye-fill "  onClick={()=> {setInputType('password')}} hidden={inputType === 'password'}></i>
      </span>
    </div>
  )
}

export default PasswordInput;
