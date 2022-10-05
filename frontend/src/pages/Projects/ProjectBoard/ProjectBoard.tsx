import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../../app/store';
import BreadCrumb, { BreadCrumbItem } from '../../../components/BreadCrumb/BreadCrumb';
import MenuCard from '../../../components/MenuCard/MenuCard';
import PageNotFound from '../../../components/PageNotFound/PageNotFound';
import { EMPTY_PROJECT } from '../../../model/types';
import Backlog from './Backlog/Backlog';
import './ProjectBoard.css';
import Sprint from './Sprint/Sprint';

interface ProjectBoardProps{

}

const ProjectBoard: FC<ProjectBoardProps> = (props) => {
    const { projectKey, view } = useParams();
    const navigate = useNavigate();
    const projects = useSelector((state: RootState) => state.projects.values)

    const viewItems: BreadCrumbItem[] = [
        {
            label: 'Backlog',
            value: 'backlog',
            children: []
        },
        {
            label: 'Board',
            value: 'board',
            children: []
        }
    ];

    // since projectBoard is a route component, you can keep selected project as non-state const.
    const selectedProject = projects.find(p => p.key === projectKey) || EMPTY_PROJECT;
    const breadCrumbLinks: BreadCrumbItem = {
        label: 'Projects',
        value: 'projects',
        children: [
            {
                label: selectedProject.name,
                value: selectedProject.key,
                children: viewItems,
                navigateTo: `/myp/projects/${projectKey}/board`
            }
        ],
        navigateTo: '/myp/projects'
    };
    const notFoundCrumb: BreadCrumbItem = {
        label: 'Page Not Found', 
        value: 'page-not-found', 
        children: []
    }; 
    const [boardView, setBoardView] = useState<BreadCrumbItem>(notFoundCrumb)

    useEffect(()=>{
        setBoardView(viewItems.find(item => item.value === view) || notFoundCrumb)
    }, [view]);

    return (
        <div className='h-100'>
            <div className='d-flex flex-nowrap h-100'>
                <div className='sidebar p-2'>
                    <div>
                        <MenuCard 
                            label='PLANNING'
                            menuItems={viewItems} 
                            handleClick={(value)=>{
                                navigate(`/myp/projects/${projectKey}/${value}`);
                            }}
                            collapsable={true}
                            showLabel={true}
                            itemClass='option-hover-thm'
                            itemType='option-quote-sm'
                            selectedItem={boardView}
                        />
                    </div>
                </div>
                <div className='px-5 py-3 board-body w-100 border h-100'>
                    <div>
                        <BreadCrumb 
                            itemTree={breadCrumbLinks}
                            selectedItem={boardView}
                            handleClick={(item: BreadCrumbItem)=>{ item.navigateTo? navigate(item.navigateTo): (()=>{})()}}
                        />
                    </div>
                    <div className='board-body'>
                        {
                            boardView.value === 'board'? <Sprint project={selectedProject}/> 
                            : boardView.value === 'backlog'? <Backlog project={selectedProject}/>
                            : <PageNotFound />
                        } 
                    </div>


                </div>
            </div>
        </div>
    )
}

export default ProjectBoard;