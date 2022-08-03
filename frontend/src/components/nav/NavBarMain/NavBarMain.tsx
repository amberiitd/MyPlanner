import { FC, useEffect, useState } from 'react';
import NavSearch from '../NavSearch/NavSearch';
import NavBarLinkList from '../NavBarLinkList/NavBarLinkList';
import NavBarToolList from '../NavBarToolList/NavBarToolList';
import NavBrand from '../NavBrand/NavBrand';
import './NavBarMain.css';
import YourWork from '../../dropdowns/YourWork/YourWork';
import Button from '../../Button/Button';
import CreateNew from '../../form/CreateNew/CreateNew';
import Projects from '../../dropdowns/Projects/Projects';
import ProjectModal from '../../dropdowns/Projects/ProjectModal/ProjectModal';
import defaultModalService from '../../../modal.service';

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
                dropdownElement: (<Projects />)
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

    const [showProjectModal, setShowProjectModal] = useState(defaultModalService.getShowModel());

    useEffect(()=>{
        defaultModalService.subscribe(()=>{
            setShowProjectModal(defaultModalService.getShowModel());
        })
    }, [])

    return (
        <div className='nav-simp d-inline-flex w-100 shadow-sm border  position-relative'>
            <NavBrand />
            <NavBarLinkList 
                items={navLinks}
                selectedItem={navLinks[0]}
            />
            <CreateNew />
            <div className='ms-auto navSearchParent'>
                <NavSearch/>
            </div>
            <div className='me-3 my-1'>
                <NavBarToolList items={toolItems} />
            </div>
            <ProjectModal 
                showModal={showProjectModal}
                handleCancel={()=>{defaultModalService.setShowModel(false)}}
            />

        </div>
    )
}

export default NavBarMain;