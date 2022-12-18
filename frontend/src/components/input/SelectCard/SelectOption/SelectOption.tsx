import { FC, useState } from 'react';
import './SelectOption.css';

interface SelectOptionProps{
    label: string;
    value: string;
    caption?: string;
    leftBsIcon?: string;
    multiSelect?: boolean;
    selected?: boolean;
    extraClasses?: string;
}

const SelectOption: FC<SelectOptionProps> = (props)=> {
    return (
        <div className={`custom-padding bg-smoke cursor-pointer d-flex flex-nowrap ${props.extraClasses}`}>
            <div className='ms-1 me-2'>
                <input 
                    className="form-check-input cursor-pointer" 
                    type="checkbox" 
                    checked={props.selected}
                    onChange={(e) => {}}
                />
            </div>
            <div className='pe-2' hidden={!props.leftBsIcon}>
                <i className={`bi bi-${props.leftBsIcon}`} style={{fontSize: '150%'}} ></i>
            </div>
            <div className=''>
                {props.label}
                <div className='caption text-cut text-muted'>
                    {props.caption}
                </div>
            </div>
        </div>
    )
}

export default SelectOption;