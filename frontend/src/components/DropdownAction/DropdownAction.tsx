import { FC, useEffect, useRef, useState } from 'react'
import Button from '../Button/Button'
import LinkCard from '../LinkCard/LinkCard';
import './DropdownAction.css'

interface DropdownActionProps{
    menuItems: any[];
    handleItemClick: (event: any) => void;
    bsIcon?: string;
    dropdownClass?: string;
}

const DropdownAction: FC<DropdownActionProps> = (props) => {
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
            <div ref={toggleRef}>
                <Button 
                    label='Create Menu'
                    hideLabel={true}
                    rightBsIcon={props.bsIcon??'three-dots-vertical'}
                    extraClasses={props.dropdownClass??'btn-as-light p-1'}
                    handleClick={()=>{}}
                />
            </div>
            

            <div className={`dropdown-menu ${showMenu? 'show': ''} shadow-sm`} style={{right: 0}}>
                <LinkCard 
                    label='Create New Menu'
                    isLoading={false}
                    linkItems={props.menuItems}
                    handleClick={props.handleItemClick} 
                    showLabel={false}                
                />
            </div>
        </div>
    )
}

export default DropdownAction;