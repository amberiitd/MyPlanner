import { FC, useEffect, useState } from 'react';
import NavSearch from '../NavSearch/NavSearch';
import NavBarLinkList from '../NavBarLinkList/NavBarLinkList';
import NavBarToolList from '../NavBarToolList/NavBarToolList';
import NavBrand from '../NavBrand/NavBrand';
import './NavBarMain.css';
import YourWork from '../../dropdowns/YourWork/YourWork';

interface NavBarMainProps{

}
const NavBarMain: FC<NavBarMainProps> = (props)=> {
    const [navLinks, setNavLinks] = useState([
            {   
                id: 0,
                label: 'Your Work',
                dropdownElement: <YourWork />
            },
            {
                id: 1,
                label: 'Projects',
                dropdownElement: (<div></div>)
            },
            {
                id: 2,
                label: 'Filters',
                dropdownElement: (<div></div>)

            },
            {
                id: 3,
                label: 'Dashboards',
                dropdownElement: (<div></div>)

            },
            {
                id: 4,
                label: 'People',
                dropdownElement: (<div></div>)

            },
            {
                id: 5,
                label: 'Apps',
                dropdownElement: (<div></div>)

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