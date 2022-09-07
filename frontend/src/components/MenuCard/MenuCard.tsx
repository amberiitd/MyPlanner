import { FC, useState } from 'react';
import BinaryAction from '../BinaryAction/BinaryAction';
import './MenuCard.css';
import MenuOption from './MenuOption/MenuOption';

interface MenuCardProps{
    label: string;
    showLabel?: boolean;
    menuItems: any[];
    selectedItem?: any;
    collapsable?: boolean;
    itemClass?: string;
    itemType?: string;
    handleClick: (event: any) => void;
}

const MenuCard: FC<MenuCardProps> = (props) => {
    const [showMenu, setShowMenu] = useState(true);
    return (
        <div className=''>
            <div className='d-flex flex-nowrap'>
                <div className='' hidden={!props.collapsable}>
                    <BinaryAction
                        label='Expand' 
                        bsIcon0= 'chevron-down' 
                        bsIcon1='chevron-right'
                        handleClick={()=>{ setShowMenu(!showMenu) }}
                    />
                </div>
                <div className='py-1 card-label' hidden={!props.showLabel}>
                    {props.label}
                </div>
            </div>
            
            <div hidden={!showMenu}>
                {props.menuItems.map((item, index) => (
                    <div className='mb-1' key={`menu-card-item-${index}`} onClick={() => {props.handleClick(item)}}>
                        <MenuOption 
                            {...item}
                            extraClasses={props.itemClass} 
                            optionType={props.itemType}
                            isSelected={props.selectedItem?.value === item.value}
                        />
                    </div>
                ))}
            </div>
            
        </div>
    ) 
}

export default MenuCard;