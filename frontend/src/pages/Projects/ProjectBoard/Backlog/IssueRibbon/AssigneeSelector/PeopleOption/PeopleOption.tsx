import { uniqueId } from 'lodash';
import React from 'react';
import { FC } from 'react';
import BinaryAction from '../../../../../../../components/BinaryAction/BinaryAction';
import ButtonCircle from '../../../../../../../components/ButtonCircle/ButtonCircle';
import { CustomOptionProps } from '../../../../../../../components/CustomOption/CustomOption';
import './PeopleOption.css';

const PeopleOption: FC<CustomOptionProps> = (props) => {
    const innerElem = (
        <React.Fragment>
            <ButtonCircle
                label={(props.label || '').split(' ').map(p => p[0]).join('') || 'P'}
                showLabel={props.value !== 'unassigned'}
                bsIcon={'person-fill'}
                size='sm'
                disabled
                onClick={()=>{}}
            />
            <div className='ms-2'>
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
        <div className={`custom-padding bg-smoke-hover d-flex flex-nowrap ${props.extraClasses}`}>
            {/*  */}
            {
                props.href?
                <a className='cursor-pointer me-auto ms-1 d-flex flex-nowrap w-100 no-link' href={props.href}>
                    {innerElem}
                </a> :
                <div className='cursor-pointer me-auto ms-1 d-flex flex-nowrap w-100' onMouseDown={(e: any)=> {(props.onClick || (()=>{}))(e)}}>
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

export default PeopleOption;