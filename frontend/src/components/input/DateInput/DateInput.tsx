import { isEmpty } from 'lodash';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import './DateInput.css';

interface DateInputProps{
    label: string;
    value: number | string | Date | undefined;
    minDate?: number | string | Date | undefined;
    hideLabel?: boolean;
    isRequired?: boolean;
    placeholder?: string;
    hidePlaceholder?: boolean;
    rightBsIcon?: string;
    clearButton?: boolean;
    disabled?: boolean; 
    handleChange: (value: any) => void;
}

const DateInput: FC<DateInputProps> = (props) => {
    const [active, setActive] = useState(false);
    const [parsedValue, setParsedValue] = useState<string | undefined>();
    const [parsedMinDate, setParsedMinDate] = useState<string | undefined>();

    useEffect(() => {
        if (typeof props.value === 'number'){
            setParsedValue(moment.unix(props.value).format('YYYY-MM-DD'));
        }
        else if (typeof props.value === 'string'){
            setParsedValue(moment(props.value).format('YYYY-MM-DD'));
        }
        else if (typeof props.value === 'object'){
            setParsedValue(moment(props.value.toISOString()).format('YYYY-MM-DD'));
        }
        else{
            setParsedValue('');
        }

        if (typeof props.minDate === 'number'){
            setParsedMinDate(moment.unix(props.minDate).format('YYYY-MM-DD'));
        }
        else if (typeof props.minDate === 'string'){
            setParsedMinDate(moment(props.minDate).format('YYYY-MM-DD'));
        }
        else if (typeof props.minDate === 'object'){
            setParsedMinDate(moment(props.minDate.toISOString()).format('YYYY-MM-DD'));
        }   
        else{
            setParsedMinDate('');
        }     
    }, [props.value, props.minDate])

    return (
        <div className="">
            <div className='' hidden={!!props.hideLabel}>
                {props.label}<span className='text-thm ms-1' style={{fontSize: 'small'}}>{props.isRequired? '*': ''}</span>
            </div>
            <div className={`d-flex flex-nowrap form-control rounded-1 ${active ? 'focus-thm': 'bg-light'}`}>
                <input 
                    className="w-100 me-2 bg-transparent" 
                    type="date" 
                    placeholder={'Select date'} 
                    value ={parsedValue} 
                    min={parsedMinDate}
                    onChange={(e)=>{props.handleChange(e.target.value)}} 
                    onFocus={()=> {setActive(true)}}
                    onBlur={()=> {setActive(false)}}
                    disabled={props.disabled}
                />
                {
                    props.clearButton && !isEmpty(parsedValue) &&
                    <div className='py-auto ms-auto cursor-pointer' 
                        onClick={(e)=> {
                            props.handleChange(undefined)
                        }}
                    >
                        <i className="bi bi-x-circle" style={{fontSize: '70%'}}></i>
                    </div>
                }
                <div className='py-auto ms-auto'>
                    <i className={`bi bi-${props.rightBsIcon}`} hidden={isEmpty(props.rightBsIcon)} style={{fontSize: '70%'}}></i>
                </div>
            </div>
        </div>
    )
}

export default DateInput;