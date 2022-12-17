import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './IssueView.css';
import Split from 'react-split';
import SideView from './SideView/SideView';
import IssueMainView from './IssueMainView/IssueMainView';
import { useQuery } from '../../../../hooks/useQuery';
import { CrudPayload } from '../../../../model/types';
import { projectCommonCrud } from '../../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { refreshIssue } from '../../../../app/slices/issueSlice';
import { Issue } from '../Backlog/IssueRibbon/IssueRibbon';
import { ProjectBoardContext } from '../ProjectBoard';
import { isEmpty } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../../../../app/store';

interface IssueViewProps{

}

const IssueView: FC<IssueViewProps> = (props) => {
    const observer = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewType, setViewType] = useState<1 | 2>(2);
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const {openProject} = useContext(ProjectBoardContext);
    const [searchParam , setSearchParam] = useSearchParams();
    const issues = useSelector((state: RootState) => state.issues);
    const openIssue = useMemo(() => {
        return issues.values.find(issue => issue.id === searchParam.get('issueId'));
    }, [issues]);
    const dispatch = useDispatch();
    const handleResize = useCallback(() => {
        if (
            containerRef && containerRef.current 
            && containerRef.current.clientWidth < 700
        ){
            setViewType(1);
        }else{
            setViewType(2);
        }
    }, [containerRef]); 

    const onContainerObserve = (node: any)=>{
        if (observer.current) observer.current.disconnect();
        observer.current = new ResizeObserver((entries) => {
            handleResize();
        });
        if (node) observer.current.observe(node);
    };

    const onRefresh = () => {
        projectCommonQuery.trigger({
            action: 'RETRIEVE',
            data: {projectId: openProject?.id,},
            itemType: 'issue'
        } as CrudPayload)
        .then((res)=>{
            dispatch(refreshIssue(res as Issue[]));
        });
    }
    useEffect(() => {
        if (!isEmpty(openProject?.id)){
            onRefresh();
        }
    }, [openProject]);


    return (
            <div ref={onContainerObserve} className='h-100'>
                <div ref={containerRef} className=' h-100 overflow-auto' style={{minWidth: '350px'}}>
                    {   
                        viewType === 2 ?
                        <Split 
                            sizes={[60, 40]}
                            // minSize={[300, 300]}
                            // maxSize={[Infinity, 600]}
                            expandToMin={false}
                            gutterSize={10}
                            gutterAlign="center"
                            snapOffset={30}
                            dragInterval={1}
                            direction="horizontal"
                            cursor="col-resize"
                            className='h-100 d-flex flex-nowrap font-thm'
                            // onDrag={(sizes) => {setWindowSizes(sizes)}}
                        >
                            <div className='overflow-auto' style={{minWidth: '400px'}}>
                                {<IssueMainView onRefresh={onRefresh} issue={openIssue}/>}
                            </div>
                            <div className='ps-3 overflow-auto' style={{minWidth: '300px'}}>
                                <SideView issue={openIssue}/>
                            </div>
                        </Split>
                        : 
                        <IssueMainView onRefresh={onRefresh} issue={openIssue}/>
                    }
                </div>
            </div>
    )
}

export default IssueView;