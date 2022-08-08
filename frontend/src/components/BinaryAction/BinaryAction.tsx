import { FC, useState } from 'react';
import './BinaryAction.css';

interface BinaryActionProps{
    label: string;
    bsIcon0: string;
    bsIcon1: string;
    handleClick: (value: any) => void;
    value?: 0 | 1;
}

const BinaryAction: FC<BinaryActionProps> = (props) => {
    const [value, setValue] = useState(props.value || 0);

    return (
        <div className='p-1 mx-1' onClick={()=> { props.handleClick(value); setValue(1-value);}}>
            <i className={`bi bi-${props.bsIcon0}`} style={{fontSize: "70%"}} hidden={value  === 1}></i>
            <i className={`bi bi-${props.bsIcon1}`} style={{fontSize: "70%"}} hidden={value  === 0}></i>
        </div>
    )
}

export default BinaryAction;