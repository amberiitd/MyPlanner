import { uniqueId } from 'lodash';
import { FC, useEffect, useRef, useState } from 'react';
import { SimpleAction } from '../../../../model/types';
import Button from '../../../Button/Button';
import './TextColors.css';

export interface TextColor extends SimpleAction{
    style: string;
}

interface TextColorsProps{
    textColorList: TextColor[];
    selectedColor: TextColor;
    onChange: (color: TextColor) => void;
}
const TextColors: FC<TextColorsProps> = (props) => {
    const [showMenu, setShowMenu] = useState(false);
    const toggleRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{

        const handleCLick = (event: any) =>{
            if (toggleRef.current && toggleRef.current.contains(event.target)){
                setShowMenu(!showMenu);
            }else{
                setShowMenu(false);
            }
        }

        document.addEventListener('click', handleCLick, true);
        return () => {document.removeEventListener('click', handleCLick, true)};
    },[showMenu]);
    
    return (
        <div className='dropdown'>
            <div ref={toggleRef} className='mx-2'>
                <Button 
                    label={'Text Color'}
                    hideLabel={true}
                    leftBsIcon={'type'}
                    rightBsIcon={'caret-down'}
                    extraClasses={'btn-as-light p-1 ps-2'}
                    handleClick={()=>{}}
                />
                <div style={{height: '2px', backgroundColor: props.selectedColor.value}}></div>
            </div>
            <div className={`dropdown-menu bg-light ${showMenu? 'show': ''} shadow-sm`} style={{left: 0}}>
                <div className='d-flex px-3'>
                    {
                        props.textColorList.map(color => (
                            <div className='rounded-3 border me-1 text-center cursor-pointer ' 
                                style={{backgroundColor: color.value, color: 'white', width: '30px', height: '30px', paddingTop: '3px'}}
                                onMouseDown={(e)=>{e.preventDefault(); props.onChange(color)}}
                                key={uniqueId()}
                            >
                                { props.selectedColor.value === color.value && <i className='bi bi-check'></i>}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default TextColors;