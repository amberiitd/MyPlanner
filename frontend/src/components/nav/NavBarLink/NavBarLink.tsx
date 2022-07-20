import { FC } from 'react'
import './NavBarLink.css'

interface NavBarLinkProps{
    label: string;
    isActive: boolean;
}
const NavBarLink: FC<NavBarLinkProps> = (props) => {

    return (
        <div className={`dropdown ms-2 pt-2 ${props.isActive? 'border-bottom border-4 border-themed': ''}`}>
            <div className='navlinkbtn d-inline-flex p-1 px-2 rounded-1'>
                {props.label}
                <i className="bi bi-chevron-down ms-1 mt-1 icon-font" style={{fontSize: "70%"}}></i>
            </div>
        </div>
    )
}

export default NavBarLink;