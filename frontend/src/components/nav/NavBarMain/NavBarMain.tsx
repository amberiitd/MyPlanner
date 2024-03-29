import { FC, useEffect, useState } from 'react';
import NavSearch from '../NavSearch/NavSearch';
import NavBarLinkList from '../NavBarLinkList/NavBarLinkList';
import NavBarToolList from '../NavBarToolList/NavBarToolList';
import NavBrand from '../NavBrand/NavBrand';
import './NavBarMain.css';
import YourWork from '../../dropdowns/YourWork/YourWork';
import CreateNew from '../../form/CreateNew/CreateNew';
import Projects from '../../dropdowns/Projects/Projects';
import Profile from './Profile/Profile';
import { useLocation, useSearchParams } from 'react-router-dom';
import { navItem } from 'aws-amplify';

interface NavBarMainProps{

}
const NavBarMain: FC<NavBarMainProps> = (props)=> {
    const [searchParam, setSearchParam] = useSearchParams();
    const location = useLocation()
    const [navLinks, setNavLinks] = useState([
            {   
                id: 0,
                label: 'Your Work',
                value: 'your-work',
                dropdownElement: <div className='f-90'><YourWork /></div>
            },
            {
                id: 1,
                label: 'Projects',
                value: 'projects',
                dropdownElement: (<div className='f-90'><Projects /></div>)
            },
            {
                id: 2,
                label: 'Filters',
                value: 'filters',
                dropdownElement: (<div></div>)

            },
            {
                id: 3,
                label: 'Dashboards',
                value: 'dashboards',
                dropdownElement: (<div></div>)

            },
            {
                id: 4,
                label: 'People',
                value: 'people',
                dropdownElement: (<div></div>)

            },
            {
                id: 5,
                label: 'Apps',
                value: 'apps',
                dropdownElement: (<div></div>)

            }
        ]
    )

    const [selectedNav, setSelectedNav] = useState(navLinks[0]);

    const [toolItems, setToolItems] = useState([
        {
            label: 'notification',
            bsIcon: 'bell-fill'
        },
        // {
        //     label: 'help',
        //     bsIcon: 'question-circle-fill'
        // },
        // {
        //     label: 'settings',
        //     bsIcon: 'gear-wide',

        // },
    ])

    useEffect(()=>{
        const subPaths = location.pathname.split('/');
        if (subPaths.length > 0){
            const navIndex = navLinks.findIndex(nav => nav.value === subPaths[2]);
            if (navIndex >=0 ){
                setSelectedNav(navLinks[navIndex])
            }
        }
    }, [location])
    return (
        <div className='nav-simp d-inline-flex w-100 shadow-sm border'>
            <NavBrand />
            <NavBarLinkList 
                    items={navLinks}
                    selectedItem={selectedNav}
                />
            <CreateNew />
            <div className='ms-auto me-1'>
                <NavSearch/>
            </div>
            <div>
                <NavBarToolList items={toolItems} />
            </div>
            <div className='me-2'>
                <Profile />
            </div>
        </div>
    )
}

export default NavBarMain;