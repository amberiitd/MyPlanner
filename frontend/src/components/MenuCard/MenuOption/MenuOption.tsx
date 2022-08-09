import { isEmpty } from 'lodash';
import { FC } from 'react';
import './MenuOption.css';

interface MenuOptionProps{
    leftBsIcon?: string;
    label: string;
    caption?: string;
    extraClasses?: string;
    optionType?: string;
    isSelected?: boolean;
}

const MenuOption: FC<MenuOptionProps> = (props) => {

    return (
        <div className={`ps-0 d-flex flex-nowrap align-items-center rounded-1 option ${isEmpty(props.extraClasses)? 'option-hover': props.extraClasses} ${props.isSelected? 'option-select': ''}`}>
            <div className={`${props.optionType?? 'option-1' } ${props.isSelected? `${props.optionType || 'option-1'}-select`: ''}`}></div>
            <div className='ms-1 pe-2' hidden={!props.leftBsIcon}>
                <i className={`bi bi-${props.leftBsIcon}`} style={{fontSize: '150%'}} ></i>
            </div>
            <div className='ms-1'>
                {props.label}
                <div className='caption text-cut text-muted'>
                    {props.caption}
                </div>
            </div>
        </div>
    )
}

export default MenuOption;