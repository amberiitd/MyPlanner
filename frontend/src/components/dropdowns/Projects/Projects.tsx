import { FC, useState } from 'react';
import LinkCard from '../../LinkCard/LinkCard';
import ProjectModal from './ProjectModal/ProjectModal';
import projectModalService from '../../../modal.service';
import './Projects.css';


interface ProjectsProps{

}

const Projects: FC<ProjectsProps> = () => {
    // const [showCreateModal, setShowCreateModal] = useState(defaultModalService.showModel);
    const handleClickOption = (item: any) => {
        if (item.value === 'create-new'){
            projectModalService.setShowModel(true);
        }
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
                            value: 'view-all'
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