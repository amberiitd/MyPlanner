import { FC } from 'react';
import { Dropdown } from 'react-bootstrap';
import { NavBarToolItem } from '../NavBarToolList/NavBarToolList';
import './NavBarTool.css';

interface NavBarToolProps{
    item: NavBarToolItem;
}
const NavBarTool: FC<NavBarToolProps> = (props) => {

    return props.item.isDropdown? (
            <div className='dropdown'>
                <div className='d-flex align-items-center justify-content-center tool-icon rounded-circle hover-focus border' id="profile-dropdown" data-bs-toggle="dropdown">
                    <i className={`bi bi-${props.item.bsIcon}`}></i>
                </div>
                <div className='dropdown-menu' aria-labelledby='profile-dropdown'>
                    {props.item.dropdownElement}
                </div>
            </div>
        ): (
            <div className=''>
                <div className='d-flex align-items-center justify-content-center tool-icon rounded-circle hover-focus border'>
                    <i className={`bi bi-${props.item.bsIcon}`}></i>
                </div>
            </div>
        )
}

export default NavBarTool;