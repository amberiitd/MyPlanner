import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { SimpleAction } from '../../model/types';
import Button from '../Button/Button'
import LinkCard from '../LinkCard/LinkCard';
import './DropdownAction.css'

interface DropdownActionProps{
    actionCategory: {label: string; value: string; items: SimpleAction[]; showLabel?: boolean; selectedItems?: SimpleAction[]}[];
    handleItemClick: (event: {category: string; item: SimpleAction}) => void;
    disabled?: boolean;
    bsIcon?: string;
    buttonText?: string; 
    buttonClass?: string;
    extraClasses?: string;
}

const DropdownAction: FC<DropdownActionProps> = (props) => {
    const [showMenu, setShowMenu] = useState(false);
    const toggleRef = useRef<HTMLDivElement>(null);
    const handleCLick = useCallback((event: any) =>{
        if (props.disabled){
            return;
        }
        if (toggleRef.current && toggleRef.current.contains(event.target)){
            setShowMenu(!showMenu);
        }else{
            setShowMenu(false);
        }
    }, [props, toggleRef]);
    
    useEffect(()=>{
        document.addEventListener('click', handleCLick, true);
        return () => {document.removeEventListener('click', handleCLick, true)};
    },[showMenu]);

    return (
        <div className='dropdown'>
            <div ref={toggleRef} className={props.extraClasses || ''}>
                <Button 
                    label={props.buttonText??'Create Menu'}
                    hideLabel={!props.buttonText}
                    rightBsIcon={props.bsIcon??'three-dots-vertical'}
                    extraClasses={props.buttonClass??'btn-as-light p-1 ps-2'}
                    disabled={!!props.disabled}
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
                            selectedLinks={cat.selectedItems}
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