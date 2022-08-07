import { FC, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import Button from '../Button/Button'
import LinkCard from '../LinkCard/LinkCard';
import './DropdownAction.css'

interface DropdownActionProps{
    menuItems: any[];
    handleItemClick: (event: any) => void;
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
                    rightBsIcon='three-dots-vertical'
                    extraClasses='btn-as-light'
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