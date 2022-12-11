import { uniqueId } from 'lodash';
import { FC, useCallback, useRef, useState } from 'react';
import { SimpleAction } from '../../../model/types';
import Button from '../../Button/Button';
import DropdownAction from '../../DropdownAction/DropdownAction';
import './ButtonSelect.css';

interface ButtonSelectProps{
    items: SimpleAction[];
    currentSelection: SimpleAction;
    onToggle: (option: SimpleAction) => void;
}

const ButtonSelect: FC<ButtonSelectProps> = (props) => {
    const observer = useRef<any>();
    const [offset, setOffset] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const handleResize = useCallback(() => {
        const containerWidth = containerRef.current?.clientWidth || 450;
        if (containerWidth && containerWidth > 300){
            setOffset(3)
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
                        <div className='ms-2' key={uniqueId()}>
                            <Button 
                                label={option.label} 
                                hideLabel={false}
                                handleClick={() =>{props.onToggle(option)}}
                                tooltip={option.label}
                                extraClasses={`px-2 py-1 ${props.currentSelection.value === option.value ? "btn-as-thm":"btn-as-bg"}`}
                            />
                        </div>
                        
                    ))
                }
                {
                    props.items.length > offset+1 &&
                    <div className='ms-1 me-2' unselectable="on" title={'Formats'}>
                        <DropdownAction 
                            actionCategory={[{
                                label: 'Formats',
                                value: 'formats',
                                items: props.items.slice(offset),
                                selectedItems: props.items.slice(offset).filter(item => item.value== props.currentSelection.value)
                            }]} 
                            buttonText={props.currentSelection.label}
                            buttonClass={props.items.slice(offset).some(item => props.currentSelection.value === item.value)? 'btn-as-thm  p-1 ps-2': undefined}
                            dropdownClass='start-0'
                            bsIcon='caret-down'
                            handleItemClick={(event) => {props.onToggle(event.item)}}
                        />
                    </div>
                }
                
            </div>
        </div>
    )
}

export default ButtonSelect;