import { isEmpty } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import './TextInput.css';

interface TextInputProps {
  label: string;
  hideLabel?: boolean;
  value: string;
  placeholder?: string;
  hidePlaceholder?: boolean;
  isRequired?: boolean;
  rightBsIcon?: string;
  focus?: boolean;
  error?: string;
  onBlur?: (e: any)=> void;
  handleChange: (value: string)=> void;
  onKeyEvent?: (e: any) => void;
}

const TextInput: FC<TextInputProps> = (props) => {
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(()=>{
    if(inputRef.current && props.focus){
        inputRef.current.focus();
    }
  }, [])

  return (
    <div className="px-1" data-testid="TextInput">
      <div className='' hidden={!!props.hideLabel}>
        {props.label}<span className='text-thm ms-1' style={{fontSize: 'small'}}>{props.isRequired? '*': ''}</span>
      </div>
      <div className={`d-flex flex-nowrap form-control rounded-1 ${active ? 'focus-thm': 'bg-light'}`}>
        <input 
          ref={inputRef}
          className="w-100 bg-transparent" 
          type="text" 
          placeholder={!!props.hidePlaceholder? '': active? (props.placeholder?? 'Enter Value'): ''} 
          value ={props.value} 
          onChange={(e)=> props.handleChange(e.target.value)} 
          onFocus={()=> {setActive(true)}}
          onBlur={(e)=> {setActive(false); (props.onBlur|| (()=> {}))(e)}}
          onKeyUp={(e)=> {if(props.onKeyEvent) props.onKeyEvent(e);}}
        />
        <div className='py-auto ms-auto'>
            <i className={`bi bi-${props.rightBsIcon}`} hidden={isEmpty(props.rightBsIcon)} style={{fontSize: '70%'}}></i>
        </div>
      </div>
      {
        !isEmpty(props.error) &&
        <div className='text-danger px-1 f-80'>
            {props.error}
        </div>
      }
    </div>
  )
  };

export default TextInput;
