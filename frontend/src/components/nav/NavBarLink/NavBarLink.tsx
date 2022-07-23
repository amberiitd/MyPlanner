import { FC, useState } from 'react'
import './NavBarLink.css'

interface NavBarLinkProps{
    label: string;
    isActive: boolean;
    dropdownElement: JSX.Element | undefined;
}
const NavBarLink: FC<NavBarLinkProps> = (props) => {

    return (
        <div className={`dropdown ms-2 pt-2 ${props.isActive? 'border-bottom border-4 border-themed': ''}`}>
            <div className='navlinkbtn d-inline-flex p-1 px-2 rounded-1' id={`nav-link-${props.label}`} data-bs-toggle="dropdown" aria-expanded="false">
                <div className='text-nowrap'>{props.label}</div>
                <i className="bi bi-chevron-down ms-1 mt-1 icon-font" style={{fontSize: "70%"}}></i>
            </div>
            <div className='dropdown-menu nav-dropdown shadow-sm' aria-labelledby={`nav-link-${props.label}`} onClick={(e)=>{e.stopPropagation()}}>
                {props.dropdownElement}
            </div>

        </div>
    )
}

export default NavBarLink;