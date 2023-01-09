import { FC } from 'react';
import { Dropdown } from 'react-bootstrap';
import ButtonCircle from '../../ButtonCircle/ButtonCircle';
import { NavBarToolItem } from '../NavBarToolList/NavBarToolList';
import './NavBarTool.css';

interface NavBarToolProps{
    item: NavBarToolItem;
}
const NavBarTool: FC<NavBarToolProps> = (props) => {

    return props.item.isDropdown? (
            <div className='dropdown'>
                <div className='' id="profile-dropdown" data-bs-toggle="dropdown">
                    <ButtonCircle 
                        label={props.item.label} 
                        bsIcon={props.item.bsIcon}
                        size='sm-2'
                        onClick={()=>{}}
                    />
                </div>
                <div className='dropdown-menu' aria-labelledby='profile-dropdown'>
                    {props.item.dropdownElement}
                </div>
            </div>
        ): (
            <div className=''>
                <ButtonCircle 
                    label={props.item.label} 
                    bsIcon={props.item.bsIcon}
                    onClick={()=>{}}
                    size='sm-2'
                />
            </div>
        )
}

export default NavBarTool;