import { createContext, FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Split from 'react-split';
import { RootState } from '../../../app/store';
import BreadCrumb, { BreadCrumbItem } from '../../../components/BreadCrumb/BreadCrumb';
import MenuCard from '../../../components/MenuCard/MenuCard';
import PageNotFound from '../../../components/PageNotFound/PageNotFound';
import { EMPTY_PROJECT } from '../../../model/types';
import Backlog from './Backlog/Backlog';
import IssueView from './IssueView/IssueView';
import './ProjectBoard.css';
import Sprint from './Sprint/Sprint';

interface ProjectBoardProps{

}

export const ProjectBoardContext = createContext<{
    windowSizes: number[]
}>({windowSizes: []});

const ProjectBoard: FC<ProjectBoardProps> = (props) => {
    const { projectKey, view } = useParams();
    const navigate = useNavigate();
    const projects = useSelector((state: RootState) => state.projects.values);
    const [windowSizes, setWindowSizes] = useState<number[]>([20, 80]);

    const menuViews: BreadCrumbItem[] = [
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

    const extraViews: BreadCrumbItem[] = [
        {
            label: 'Issue',
            value: 'issue',
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
                children: menuViews.concat(extraViews),
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
        setBoardView(menuViews.concat(extraViews).find(item => item.value === view) || notFoundCrumb)
    }, [view]);

    return (
        <ProjectBoardContext.Provider value={{windowSizes}}>
            <div className='h-100'>
                <Split className='d-flex flex-nowrap h-100'
                    sizes={windowSizes}
                    minSize={200}
                    maxSize={[600, Infinity]}
                    expandToMin={false}
                    gutterSize={10}
                    gutterAlign="center"
                    snapOffset={30}
                    dragInterval={1}
                    direction="horizontal"
                    cursor="col-resize"
                    onDrag={(sizes) => {setWindowSizes(sizes)}}
                >
                    <div className=' p-2'>
                        <div>
                            <MenuCard 
                                label='PLANNING'
                                menuItems={menuViews} 
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
                    <div className='px-3 py-3 board-body h-100'>
                        <div>
                            <BreadCrumb 
                                itemTree={breadCrumbLinks}
                                selectedItem={boardView}
                                handleClick={(item: BreadCrumbItem)=>{ item.navigateTo? navigate(item.navigateTo): (()=>{})()}}
                            />
                        </div>
                        <div className='board-body'>
                            {/* <Routes>
                                <Route path ='/board' element={<Sprint project={selectedProject}/>}/>
                                <Route path ='/backlog' element={<Backlog project={selectedProject}/>}/>
                                <Route path ='/issue/:viewParam1' element={<IssueView />}/>
                                <Route path ='*' element={<PageNotFound />}/>
                            </Routes> */}
                            {
                                boardView.value === 'board'?  <Sprint project={selectedProject}/>
                                : boardView.value === 'backlog'? <Backlog project={selectedProject}/>
                                : boardView.value === 'issue'? <IssueView />
                                : <PageNotFound />
                            } 
                        </div>


                    </div>
                </Split>
            </div>
        </ProjectBoardContext.Provider>
    )
}

export default ProjectBoard;