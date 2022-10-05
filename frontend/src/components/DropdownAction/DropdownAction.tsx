import { FC, useEffect, useRef, useState } from 'react'
import { SimpleAction } from '../../model/types';
import Button from '../Button/Button'
import LinkCard from '../LinkCard/LinkCard';
import './DropdownAction.css'

interface DropdownActionProps{
    actionCategory: {label: string; value: string; items: SimpleAction[]; showLabel?: boolean;}[];
    handleItemClick: (event: {category: string; item: SimpleAction}) => void;
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
            

            <div className={`dropdown-menu bg-light ${showMenu? 'show': ''} shadow-sm`} style={{right: 0}}>
                {
                   props.actionCategory.map((cat, index) => (
                    <div className='bg-white mt-1' key={`action-cat-${cat.label}`}>
                        <LinkCard 
                            label={cat.label}
                            isLoading={false}
                            linkItems={cat.items}
                            handleClick={(item: any) => {props.handleItemClick({category: cat.value, item})}} 
                            showLabel={cat.showLabel?? false}                
                        />
                    </div>
                   ))
                }
            </div>
        </div>
    )
}

export default DropdownAction;