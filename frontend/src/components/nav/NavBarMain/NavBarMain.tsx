import { FC, useEffect, useState } from 'react';
import NavBarLinkList from '../NavBarLinkList/NavBarLinkList';
import NavBrand from '../NavBrand/NavBrand';
import './NavBarMain.css';

interface NavBarMainProps{

}
const NavBarMain: FC<NavBarMainProps> = (props)=> {
    const [navLinks, setNavLinks] = useState([
            {   
                id: 1,
                label: 'Projects',
            },
            {
                id: 2,
                label: 'Filters',
            },
            {
                id: 3,
                label: 'Dashboards',
            },
            {
                id: 4,
                label: 'People',
            },
            {
                id: 5,
                label: 'Apps',
            }
        ]
    )
    return (
        <div className='nav-simp d-inline-flex w-100 shadow-sm border'>
            <NavBrand />
            <NavBarLinkList 
                items={navLinks}
                selectedItem={navLinks[0]}
            />
            {/* <NavSearch />
            <NavRightToolBar /> */}

        </div>
    )
}

export default NavBarMain;