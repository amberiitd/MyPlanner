import { FC, useState } from 'react';
import TextInput from '../../input/TextInput/TextInput';
import './Summary.css';

interface SummaryProps{
    onChange: (text: string) => void;
}

const Summary: FC<SummaryProps> = (props) => {
    const [value, setValue] = useState('');
    return (
        <div>
            <TextInput 
                label='Summary'
                value={value}
                isRequired={true}
                hidePlaceholder={true}
                handleChange={(value: string)=> { setValue(value);  props.onChange(value);}}
            />
        </div>
    )
}

export default Summary;