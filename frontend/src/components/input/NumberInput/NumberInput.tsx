import { FC, useState } from 'react';
import './NumberInput.css';

interface NumberInputProps{
    label: string;
    hideLabel?: boolean;
    value: number | undefined;
    isRequired?: boolean;
    handleChange: (value: number)=> void;
}

const NumberInput: FC<NumberInputProps> =(props) => {

    const [active, setActive] = useState(false);
    return (
        <div className="px-1" data-testid="TextInput">
            <div className='' hidden={!!props.hideLabel}>
                {props.label}{props.isRequired? '*': ''}
            </div>
            <div className={`form-control rounded-1 ${active ? 'focus-thm': 'bg-light'}`}>
                <input 
                className="w-100 bg-transparent" 
                type="number" 
                value ={props.value} 
                onChange={(e)=> props.handleChange(parseFloat(e.target.value))} 
                onFocus={()=> {setActive(true)}}
                onBlur={()=> {setActive(false)}}
                />
            </div>
        </div>
    )
}

export default NumberInput;