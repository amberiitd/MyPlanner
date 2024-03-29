import { FC, useState } from 'react';
import './BinaryAction.css';

interface BinaryActionProps{
    label: string;
    bsIcon0: string;
    bsIcon1: string;
    handleClick: (value: any) => void;
    value?: 0 | 1;
    extraClasses?: string;
}

const BinaryAction: FC<BinaryActionProps> = (props) => {
    const [value, setValue] = useState(props.value || 0);

    return (
        <div className='mx-0 cursor-pointer' onClick={()=> { setValue(1-value); props.handleClick(value); }}>
            <i className={`bi bi-${props.bsIcon0} ${props.extraClasses?? 'icon'}`} hidden={value  === 1}></i>
            <i className={`bi bi-${props.bsIcon1} ${props.extraClasses?? 'icon'}`} hidden={value  === 0}></i>
        </div>
    )
}

export default BinaryAction;