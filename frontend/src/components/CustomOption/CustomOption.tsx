import { uniqueId } from 'lodash';
import React, { useMemo } from 'react';
import { FC } from 'react';
import BinaryAction from '../BinaryAction/BinaryAction';
import './CustomOption.css';

export interface CustomOptionAction{
    label: string;
    value: string;
    bsIcon: string;
    flipBsIcon?: string;
    handleClick: (event: any) => void;
}

export interface CustomOptionProps{
    label: string;
    value: string;
    href?: string;
    caption?: string | string[];
    leftBsIcon?: string;
    rightBsIcon?: string;
    extraClasses?: string;
    actions?: CustomOptionAction[];
    onClick?: (e: MouseEvent)=> void;
}

const CustomOption: FC<CustomOptionProps> = (props) => {
    const innerElem = useMemo(() => (
        <React.Fragment>
            <div className='pe-2' hidden={!props.leftBsIcon}>
                <i className={`bi bi-${props.leftBsIcon}`} style={{fontSize: '100%'}} ></i>
            </div>
            <div>
                <div>{props.label}</div>
                <div className='caption text-cut text-muted'>
                    {
                        props.caption && typeof props.caption === 'string' &&
                        <span>
                            {props.caption}
                        </span>
                    }
                    {
                        props.caption && typeof props.caption !== 'string' &&
                        <React.Fragment>
                            {
                                props.caption.slice(0, props.caption.length -1).map((cap, index) => (
                                    <span key={`custom-option-caption-${index}`}>
                                        {cap}<span className='px-1'>.</span>
                                    </span>
                                ))
                            }
                            <span>
                                {props.caption[props.caption.length-1]}
                            </span>
                        </React.Fragment>
                        
                        
                    }
                </div>
            </div>
        </React.Fragment>
    ), [props]);

    return (
        <div className={`custom-padding bg-smoke-hover d-flex flex-nowrap ${props.extraClasses}`}>
            {/*  */}
            {
                props.href?
                <a className='cursor-pointer me-auto d-flex flex-nowrap w-100 no-link' href={props.href}>
                    {innerElem}
                </a> :
                <div className='cursor-pointer me-auto d-flex flex-nowrap w-100' 
                    onClick={(e: any)=> {(props.onClick || (()=>{}))(e);}}
                >
                    {innerElem}
                </div>
            }
            <div className='d-flex flex-nowrap' style={{zIndex: 10}}>
                {
                    props.actions?.map( (action, index) => (
                        // there might be an issue with click action since parent has a click action
                        <BinaryAction key={index}
                            label={action.label}
                            bsIcon0={action.bsIcon}
                            bsIcon1={action.flipBsIcon || action.bsIcon}
                            handleClick={(event: any)=> {action.handleClick(action.value || action.label)}}
                            
                        />
                    ) )
                }
                <div className='' hidden={!props.rightBsIcon}>
                    <i className={`bi bi-${props.rightBsIcon}`} style={{fontSize: '70%'}} ></i>
                </div>
            </div>
        </div>
    )
}

export default CustomOption;