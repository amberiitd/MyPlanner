import { uniqueId } from 'lodash';
import { FC, useCallback, useRef, useState } from 'react';
import { SimpleAction } from '../../model/types';
import Button from '../Button/Button';
import DropdownAction from '../DropdownAction/DropdownAction';

interface ButtonActionGroupProps{
    items: SimpleAction[];
    onClick: (option: SimpleAction) => void;
}

const ButtonActionGroup: FC<ButtonActionGroupProps> = (props) => {
    const observer = useRef<any>();
    const [offset, setOffset] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const handleResize = useCallback(() => {
        const containerWidth = containerRef.current?.clientWidth || 450;
        if (containerWidth && containerWidth > 80){
            setOffset(1)
        }else{
            setOffset(0)
        }
    }, [containerRef]);
        
    const onContainerObserve = (node: any)=>{
        if (observer.current) observer.current.disconnect();
        observer.current = new ResizeObserver((entries) => {
            handleResize();
        });
        if (node) observer.current.observe(node);
    };

    return (
        <div ref={onContainerObserve}>
            <div ref={containerRef} className='d-flex flex-nowrap'>
                
                {
                    props.items.slice(0, offset).map(option => (
                        <div className='border-end rounded' key={uniqueId()}>
                            <Button 
                                label={option.label} 
                                hideLabel={false}
                                handleClick={() =>{props.onClick(option)}}
                                tooltip={option.label}
                                leftBsIcon={option.leftBsIcon}
                                extraClasses={'btn-as-light ps-1'}
                            />
                        </div>
                    ))
                }
                {
                    props.items.length >= offset+1 &&
                    <div className='' unselectable="on" title={'Actions'} style={{marginLeft: '-4px'}}>
                        <DropdownAction 
                            actionCategory={[{
                                label: 'Actions',
                                value: 'action',
                                items: props.items.slice(offset),
                            }]} 
                            buttonClass={'ps-1 btn-as-light'}
                            dropdownClass='start-0'
                            bsIcon={offset=== 0 ? 'cursor': 'caret-down'}
                            handleItemClick={(event) => {props.onClick(event.item)}}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default ButtonActionGroup;