import { FC, useState } from 'react'
import NumberInput from '../../input/NumberInput/NumberInput'
import './StoryPoint.css'

interface StoryPointProps{

}

const StoryPoint: FC<StoryPointProps> = () => {
    const [value, setValue] = useState<number>();
    return (
        <div>
            <NumberInput 
                label='Story point estimate'
                value={value}
                handleChange={(value: number) => setValue(value)}
            />
        </div>
    )
}

export default StoryPoint;