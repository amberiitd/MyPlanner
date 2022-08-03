import React, { FC, useState } from 'react';
import './TextInput.css';

interface TextInputProps {
  label: string;
  hideLabel?: boolean;
  value: string;
  placeholder?: string;
  hidePlaceholder?: boolean;
  isRequired?: boolean;
  handleChange: (value: string)=> void;
}

const TextInput: FC<TextInputProps> = (props) => {
  const [active, setActive] = useState(false);

  return (
    <div className="" data-testid="TextInput">
      <div className='' hidden={!!props.hideLabel}>
        {props.label}{props.isRequired? '*': ''}
      </div>
      <div className={`form-control rounded-1 ${active ? 'focus-thm': 'bg-light'}`}>
        <input 
          className="w-100 bg-transparent" 
          type="text" 
          placeholder={!!props.hidePlaceholder? '': props.placeholder?? 'Enter Value'} 
          value ={props.value} 
          onChange={(e)=> props.handleChange(e.target.value)} 
          onFocus={()=> {setActive(true)}}
          onBlur={()=> {setActive(false)}}
        />
      </div>
    </div>
  )
  };

export default TextInput;
