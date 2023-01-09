import { FC, useState } from 'react'
import NumberInput from '../../input/NumberInput/NumberInput'
import './StoryPoint.css'

interface StoryPointProps{
    onChange: (value: number) => void;
}

const StoryPoint: FC<StoryPointProps> = (props) => {
    const [value, setValue] = useState<number>(0);
    return (
        <div>
            <NumberInput 
                label='Story point estimate'
                value={value}
                handleChange={(value: number) => {setValue(value); props.onChange(value);}}
            />
        </div>
    )
}

export default StoryPoint;