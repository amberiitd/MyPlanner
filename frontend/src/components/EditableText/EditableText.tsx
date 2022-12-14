import { FC, useEffect, useRef, useState } from "react";
import Button from "../Button/Button";

interface EditableTextProps{
    value: string;
    prefix?: string;
    onSave: (value: string) => void;
    onCancel?: ()=> void;
    inputClasses?: string;
    extraClasses?: string;
    edit?: boolean;
}

const EditableText: FC<EditableTextProps> = (props) =>{
    const [active, setActive] = useState(!!props.edit);
    const [value, setValue] = useState(props.value);
    const handleSave = () => {
        if (value && props.value !== value){
            props.onSave(value);
        }
        setActive(false);
        (props.onCancel || (()=>{}))();
    }

    const compRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const handleWindowClick = (e: any) => {
            if(compRef && compRef.current && compRef.current.contains(e.target)){

            }else{
                setActive(false);
                (props.onCancel || (()=>{}))();
            }
        }

        document.addEventListener('click', handleWindowClick, true);

        return () => {
            document.removeEventListener('click', handleWindowClick, true);
        }
    }, [])
    return (
        <div ref={compRef} className='w-100'>
            <span className={`px-2 rounded-pill ${props.extraClasses} cursor-pointer`} onClick={()=> {setActive(true)}} hidden={active}>
                {(value + props.prefix) || '-'}
            </span>
            <div className='position-relative' hidden={!active} style={{zIndex: 3}}>
                <div className="">
                    <input className={`rounded input-focus p-1 ${props.inputClasses?? 'w-100'}`} type="text" value={value} onChange={(e)=> {setValue(e.target.value)}}/>
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
                                setValue((props.value) || '-'); 
                                (props.onCancel || (()=>{}))();
                                setActive(false);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditableText;