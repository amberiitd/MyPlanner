import { FC, useEffect, useState } from 'react';
import NavSearch from '../../NavSearch/NavSearch';
import NavBarLinkList from '../NavBarLinkList/NavBarLinkList';
import NavBarToolList from '../NavBarToolList/NavBarToolList';
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

    const [toolItems, setToolItems] = useState([
        {
            label: 'notification',
            bsIcon: 'bell-fill'
        },
        {
            label: 'help',
            bsIcon: 'question-circle-fill'
        },
        {
            label: 'settings',
            bsIcon: 'gear-wide',

        },
        {
            label: 'profile',
            bsIcon: 'person-circle'
        }
    ]) 
    return (
        <div className='nav-simp d-inline-flex w-100 shadow-sm border  position-relative'>
            <NavBrand />
            <NavBarLinkList 
                items={navLinks}
                selectedItem={navLinks[0]}
            />
            <div className='ms-auto navSearchParent'>
                <NavSearch/>
            </div>
            <div className='me-3 my-1'>
                <NavBarToolList items={toolItems} />
            </div>
            

        </div>
    )
}

export default NavBarMain;