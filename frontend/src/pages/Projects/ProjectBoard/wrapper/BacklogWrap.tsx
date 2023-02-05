import { FC, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Split from 'react-split';
import BreadCrumb, { BreadCrumbItem } from "../../../../components/BreadCrumb/BreadCrumb";
import Backlog from "../Backlog/Backlog";
import { ProjectBoardContext } from "../ProjectBoard";
import BaseSideMenu from "../SideMenus/BaseSideMenu";
import '../ProjectBoard.css';


export const notFoundCrumb: BreadCrumbItem = {
    label: 'Page Not Found', 
    value: 'page-not-found', 
    children: []
};

const BacklogWrap: FC = () => {
    const location = useLocation();
    const {openProject} = useContext(ProjectBoardContext);
    const navigate = useNavigate();

    const menuViews: BreadCrumbItem[] = useMemo(() => [
        {
            label: 'Backlog',
            value: 'backlog',
            children: [],
            leftBsIcon: 'card-list',
            navigateTo: `/myp/projects/${openProject?.key}/backlog`
        },
        {
            label: 'Board',
            value: 'board',
            children: [],
            leftBsIcon: 'layout-three-columns',
            navigateTo: `/myp/projects/${openProject?.key}/board`
        },
    ], [openProject]);
    
    const extraViews: BreadCrumbItem[] = [
        {
            label: 'Issue',
            value: 'issue',
            children: []
        }
    ];
    
    const breadCrumbLinks: BreadCrumbItem = useMemo(() => ({
        label: 'Projects',
        value: 'projects',
        children: [
            {
                label: openProject?.name || '',
                value: openProject?.key || '',
                children: menuViews.concat(extraViews),
                navigateTo: `/myp/projects/${openProject?.key}/board`,
            }
        ],
        navigateTo: '/myp/projects'
    }), [openProject]);

    const boardView = useMemo(()=> {
        const parts = location.pathname.split('/');
        return menuViews.concat(extraViews).find(item => item.value === parts[parts.length -1]) || notFoundCrumb;
    }, [location])

    return (
        <div className='h-100'>
            <Split className='d-flex flex-nowrap h-100'
                sizes={[20, 80]}
                minSize={200}
                maxSize={[600, Infinity]}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={0}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
                // onDrag={(sizes) => {setWindowSizes(sizes)}}
            >
                <div className=' p-2'>
                    <BaseSideMenu menuViews={menuViews} boardView={boardView}/>
                </div>
                <div className='px-3 py-3 board-body h-100'>
                    <div className='h4em'>
                        <BreadCrumb 
                            itemTree={breadCrumbLinks}
                            selectedItem={boardView}
                            handleClick={(item: BreadCrumbItem)=>{ item.navigateTo? navigate(item.navigateTo): (()=>{})()}}
                        />
                    </div>
                    {
                        openProject &&
                        <div className='board-body h100-4em'>
                            <Backlog project={openProject}/>
                        </div>
                    }
                </div>
            </Split>
        </div>
    )
}

export default BacklogWrap;