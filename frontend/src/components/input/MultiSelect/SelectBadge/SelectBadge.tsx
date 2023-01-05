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
        <div className='d-flex flex-nowrap rounded-1 border py-0 f-80 bg-light'>
            <div className='text-nowrap ps-1 d-flex align-items-center' style={{fontSize: 'small'}}>
                {props.label}
            </div>
            <div>
                <Button 
                    label='Cancel'
                    hideLabel={true}
                    leftBsIcon='x'
                    extraClasses='btn-as-bg px-1'
                    handleClick={()=>props.handleCancel(props.value)}
                />
            </div>
        </div>
    )
}

export default SelectBadge;