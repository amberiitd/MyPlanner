import { FC } from 'react';
import './MenuCard.css';
import MenuOption from './MenuOption/MenuOption';

interface MenuCardProps{
    label: string;
    showLabel?: boolean;
    menuItems: any[];
    selectedItem?: any;
    handleClick: (event: any) => void;
}

const MenuCard: FC<MenuCardProps> = (props) => {

    return (
        <div className=''>
            <div className='p-1 ps-3 label-card' hidden={!props.showLabel}>{props.label}</div>
            <div>
                {props.menuItems.map((item, index) => (
                    <div className='mb-1' key={`menu-card-item-${index}`} onClick={() => {props.handleClick(item.value)}}>
                        <MenuOption 
                            {...item}
                            extraClasses={props.selectedItem?.value === item.value ? 'select-option': ''}
                        />
                    </div>
                ))}
            </div>
            
        </div>
    ) 
}

export default MenuCard;