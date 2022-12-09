import { FC, useContext, useState } from 'react';
import LinkCard from '../../LinkCard/LinkCard';
import ProjectModal from './ProjectModal/ProjectModal';
import projectModalService from '../../../modal.service';
import './Projects.css';
import { useNavigate } from 'react-router-dom';
import { NavDropDownContext } from '../../nav/NavBarLink/NavBarLink';


interface ProjectsProps{

}

const Projects: FC<ProjectsProps> = () => {
    // const [showCreateModal, setShowCreateModal] = useState(defaultModalService.showModel);
    const navigate = useNavigate();
    const {setDropdown} = useContext(NavDropDownContext);

    const handleClickOption = (item: any) => {
        if (item.value === 'create-new'){
            projectModalService.setShowModel(true);
        }
        setDropdown(false);
    }
    return (
        <div className='projects'>
            <LinkCard 
                label='Recent'
                showLabel={true}
                isLoading={false}
                linkItems={[]}
                handleClick={(event: any) => {}}
            />

            <div>
                <hr className='w-100 m-0'/>
                <LinkCard 
                    label='project-footer'
                    showLabel={false}
                    isLoading={false}
                    linkItems={[
                        {
                            label: 'View all projects',
                            value: 'view-all',
                            href: '/myp/projects'
                        },
                        {
                            label: 'Create project',
                            value: 'create-new'
                        }
                    ]}
                    handleClick={handleClickOption}
                />
            </div>

        </div>
    )
}

export default Projects;