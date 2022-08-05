import { isEmpty } from 'lodash';
import { FC } from 'react';
import './MenuOption.css';

interface MenuOptionProps{
    leftBsIcon?: string;
    label: string;
    caption?: string;
    extraClasses?: string;
}

const MenuOption: FC<MenuOptionProps> = (props) => {

    return (
        <div className={`d-flex flex-nowrap rounded-1 option ${isEmpty(props.extraClasses)? 'option-hover': props.extraClasses}`}>
            <div className='pe-2' hidden={!props.leftBsIcon}>
                <i className={`bi bi-${props.leftBsIcon}`} style={{fontSize: '150%'}} ></i>
            </div>
            <div className=''>
                {props.label}
                <div className='caption text-cut text-muted'>
                    {props.caption}
                </div>
            </div>
        </div>
    )
}

export default MenuOption;