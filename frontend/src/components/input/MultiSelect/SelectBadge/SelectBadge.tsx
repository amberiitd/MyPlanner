import { FC } from 'react';
import Button from '../../../Button/Button';
import './SelectBadge.css';

interface SelectBadgeProps{
    label: string;
    value: string;
    handleCancel: (value: string) => void;
}

const SelectBadge: FC<SelectBadgeProps> = (props) => {

    return (
        <div className='d-flex flex-nowrap rounded-1 border py-0'>
            <div className='text-nowrap px-1' style={{fontSize: 'small'}}>
                {props.label}
            </div>
            <div>
                <Button 
                    label='Cancel'
                    hideLabel={true}
                    rightBsIcon='x'
                    extraClasses='btn-as-bg p-0'
                    handleClick={()=>props.handleCancel(props.value)}
                />
            </div>
        </div>
    )
}

export default SelectBadge;