import { FC, useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import './NumberBadge.css';

interface NumberBadgeProps{
    data: string | number | undefined;
    extraClasses?: string;
    inputClasses?: string;
    onValueChange: (value: number) => void;
}

const NumberBadge: FC<NumberBadgeProps> = (props) => {
    const [value, setValue] = useState<number | undefined>(props.data? parseFloat(props.data.toString()): undefined);
    const [active, setActive] = useState(false);
    const handleSave = () => {
        if (value && props.data !== value){
            props.onValueChange(value);
        }
        setActive(false);
    }

    const compRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const handleWindowClick = (e: any) => {
            if(compRef && compRef.current && compRef.current.contains(e.target)){

            }else{
                setActive(false);
            }
        }

        document.addEventListener('click', handleWindowClick, true);

        return () => {
            document.removeEventListener('click', handleWindowClick, true);
        }
    }, [])
    return (
        <div ref={compRef} className='w-100'>
            <div className={`px-2 rounded-pill ${props.extraClasses} cursor-pointer w-inherit`} onClick={()=> {setActive(true)}} hidden={active}>
                {value || '-'}
            </div>
            <div className='position-relative' hidden={!active}>
                <div>
                    <input className={`rounded input-focus ${props.inputClasses?? 'w-100'}`} type="number" value={value} onChange={(e)=> {setValue(parseFloat(e.target.value))}}/>
                </div>
                
                <div className='d-flex flex-nowrap position-absolute w-100 mt-1'>
                    <div className='me-1'>
                        <Button 
                            label='Save'
                            hideLabel={true}
                            leftBsIcon='check'
                            extraClasses='ps-2 btn-as-light'
                            handleClick={handleSave}
                        />
                    </div>
                    <div className='ms-auto'>
                        <Button 
                            label='Cancel'
                            hideLabel={true}
                            leftBsIcon='x-lg'
                            extraClasses='ps-2 btn-as-light'
                            handleClick={()=>{
                                setValue(props.data? parseFloat(props.data.toString()): undefined); setActive(false)
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NumberBadge;

