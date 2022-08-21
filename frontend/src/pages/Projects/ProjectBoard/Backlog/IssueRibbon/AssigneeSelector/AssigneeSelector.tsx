import { FC, useEffect, useRef, useState } from 'react';
import Button from '../../../../../../components/Button/Button';
import DropdownAction from '../../../../../../components/DropdownAction/DropdownAction';
import TextInput from '../../../../../../components/input/TextInput/TextInput';
import './AssigneeSelector.css';

interface AssigneeSelectorProps{

}

const AssigneeSelector: FC<AssigneeSelectorProps> = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const compRef = useRef<HTMLDivElement>(null);

    useEffect(()=> {
        const handleWindowClick = (e: any) => {
            if(compRef && compRef.current && compRef.current.contains(e.target)){

            }
            else{
                setDropdown(false);
            }
        };

        document.addEventListener('click', handleWindowClick, true);

        return () => {
            document.removeEventListener('click', handleWindowClick, true);
        }
    }, [])
    return (
        <div ref={compRef} className='dropdown'>
            <div className='mx-1'>
                <Button
                    label='NA'
                    extraClasses='rounded-circle circle-2 btn-as-thm'
                    handleClick={()=>{setDropdown(!dropdown)}}
                />
            </div>
            <div className={`dropdown-menu shadow-sm bg-light ${dropdown? 'show': ''}`} style={{right: 0}}>
                <div>
                    <TextInput 
                        label='Search'
                        hideLabel={true}
                        value={'Hello'}
                        handleChange={()=>{}} 
                    />
                </div>
            </div>
        </div>
    )
}
export default AssigneeSelector;