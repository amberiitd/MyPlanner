import { uniqueId } from 'lodash';
import React from 'react';
import { FC } from 'react';
import BinaryAction from '../BinaryAction/BinaryAction';
import './CustomOption.css';

interface CustomOptionAction{
    label: string;
    value: string;
    bsIcon: string;
    flipBsIcon?: string;
    handleClick: (event: any) => void;
}

interface CustomOptionProps{
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
    const innerElem = (
        <React.Fragment>
            <div className='pe-2' hidden={!props.leftBsIcon}>
                <i className={`bi bi-${props.leftBsIcon}`} style={{fontSize: '150%'}} ></i>
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
                        props.caption.map(cap => (
                            <span key={uniqueId()}>
                                {cap}<span className='px-1'>.</span>
                            </span>
                        ))
                        
                    }
                </div>
            </div>
        </React.Fragment>
    );

    return (
        <div className={`px-3 py-2 bg-smoke d-flex flex-nowrap ${props.extraClasses}`}>
            {/*  */}
            {
                props.href?
                <a className='cursor-pointer me-auto d-flex flex-nowrap w-100 no-link' href={props.href}>
                    {innerElem}
                </a> :
                <div className='cursor-pointer me-auto d-flex flex-nowrap w-100' onMouseDown={(e: any)=> {(props.onClick || (()=>{}))(e)}}>
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