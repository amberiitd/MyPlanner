import React, { FC } from 'react';
import './TextInput.css';

interface TextInputProps {
  value: string;
  handleChange: (value: string)=> void;
}

const TextInput: FC<TextInputProps> = (props) => (
  <div className="" data-testid="TextInput">
    <input className="form-control" type="text" placeholder='Enter email' value ={props.value} onChange={(e)=> props.handleChange(e.target.value)}/>
  </div>
);

export default TextInput;
