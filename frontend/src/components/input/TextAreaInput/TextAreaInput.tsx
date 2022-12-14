import { FC, useState } from 'react';
import './TextAreaInput.css';

interface TextAreaInputProps{
    label: string;
    hideLabel?: boolean;
    value: string;
    placeholder?: string;
    hidePlaceholder?: boolean;
    isRequired?: boolean;
    handleChange: (value: string)=> void;
}

const TextAreaInput: FC<TextAreaInputProps> = (props) => {
    const [active, setActive] = useState(false);

    return (
        <div className="px-1" data-testid="TextInput">
            <div className='' hidden={!!props.hideLabel}>
                {props.label}<span className='text-thm ms-1' style={{fontSize: 'small'}}>{props.isRequired? '*': ''}</span>
            </div>
            <div className={`d-flex flex-nowrap form-control rounded-1 ${active ? 'focus-thm': 'bg-light'}`}>
                <textarea 
                    className="w-100 bg-transparent border-0" 
                    placeholder={!!props.hidePlaceholder? '': active? (props.placeholder?? 'Enter Value'): ''} 
                    value ={props.value} 
                    onChange={(e)=> props.handleChange(e.target.value)} 
                    onFocus={()=> {setActive(true)}}
                    onBlur={()=> {setActive(false)}}
                />
            </div>
        </div>
    )
}

export default TextAreaInput;