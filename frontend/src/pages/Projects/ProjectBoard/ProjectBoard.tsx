import { FC } from 'react';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';
import MenuCard from '../../../components/MenuCard/MenuCard';
import Backlog from './Backlog/Backlog';
import './ProjectBoard.css';
import Sprint from './Sprint/Sprint';

interface ProjectBoardProps{

}

const ProjectBoard: FC<ProjectBoardProps> = (props) => {

    const breadCrumbLinks = {
        label: 'Projects',
        value: 'projects',
        children: [
            {
                label: 'Test Project 1',
                value: 'prohect-1',
                children: [
                    {
                        label: 'Board',
                        value: 'board',
                        children: []
                    }
                ]
            }
        ]
    };

    return (
        <div className='h-100'>
            <div className='d-flex flex-nowrap h-100'>
                <div className='sidebar p-2'>
                    <div>
                        <MenuCard 
                            label='PLANNING'
                            menuItems={[
                                {
                                    label: 'Backlog',
                                    value: 'backlog'
                                },
                                {
                                    label: 'Board',
                                    value: 'board'
                                }
                            ]} 
                            handleClick={()=>{}}
                            collapsable={true}
                            showLabel={true}
                            itemClass='option-hover-thm'
                            itemType='option-quote-sm'
                            selectedItem={{
                                label: 'Backlog',
                                value: 'backlog'
                            }}
                        />
                    </div>
                </div>
                <div className='px-5 py-3 board-body w-100 border'>
                    <div>
                        <BreadCrumb 
                            itemTree={breadCrumbLinks}
                            selectedItem={breadCrumbLinks.children[0].children[0]}
                            handleClick={()=>{}}
                        />
                    </div>
                    <div hidden={true}>
                        <Sprint />
                    </div>
                    <div hidden={false}>
                        <Backlog />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectBoard;