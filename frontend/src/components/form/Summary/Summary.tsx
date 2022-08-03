import { FC, useState } from 'react';
import TextInput from '../../input/TextInput/TextInput';
import './Summary.css';

interface SummaryProps{}

const Summary: FC<SummaryProps> = (props) => {
    const [value, setValue] = useState('');
    return (
        <div>
            <TextInput 
                label='Summary'
                value={value}
                isRequired={true}
                hidePlaceholder={true}
                handleChange={(value: string)=> { setValue(value) }}
            />
        </div>
    )
}

export default Summary;