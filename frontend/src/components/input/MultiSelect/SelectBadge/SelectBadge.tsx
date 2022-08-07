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
        <div className='d-flex flex-nowrap rounded-1 border'>
            <div className='text-nowrap'>
                {props.label}
            </div>
            <div>
                <Button 
                    label='Cancel'
                    hideLabel={true}
                    rightBsIcon='x'
                    extraClasses='btn-as-bg'
                    size='sm'
                    handleClick={()=>props.handleCancel(props.value)}
                />
            </div>
        </div>
    )
}

export default SelectBadge;