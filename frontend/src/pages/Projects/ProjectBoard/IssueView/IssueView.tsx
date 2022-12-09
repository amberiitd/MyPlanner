import { createContext, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './IssueView.css';
import Split from 'react-split';
import DropdownAction from '../../../../components/DropdownAction/DropdownAction';
import TextEditor from '../../../../components/input/TextEditor/TextEditor';
import { ProjectBoardContext } from '../ProjectBoard';
import Activity from './Activity/Activity';
import SideView from './SideView/SideView';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useQuery } from '../../../../hooks/useQuery';
import { CrudPayload } from '../../../../model/types';
import { commonCrud } from '../../../../services/api';
import { useDispatch } from 'react-redux';
import { refreshIssue } from '../../../../app/slices/issueSlice';
import { Issue } from '../Backlog/IssueRibbon/IssueRibbon';

interface IssueViewProps{

}


export const IssueViewContext = createContext<{
    windowSizes: number[]
}>({windowSizes: []});


const IssueView: FC<IssueViewProps> = (props) => {
    const [windowSizes, setWindowSizes] = useState<number[]>([60, 40]);
    const boardSizes = useContext(ProjectBoardContext).windowSizes;
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewType, setViewType] = useState<1 | 2>(2);
    const [searchParam , setSearchParam] = useSearchParams();
    const issues = useSelector((state: RootState) => state.issues);
    const openIssue = useMemo(() => {
        return issues.values.find(issue => issue.id === searchParam.get('issueId'));
    }, [issues]);
    const issueQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
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

    useEffect(() => {
        handleResize();
    }, [boardSizes, containerRef]);

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        if (!issues.loaded){
            issueQuery.trigger({
                action: 'RETRIEVE',
                data: {},
                itemType: 'issue'
            } as CrudPayload)
            .then((res)=>{
                dispatch(refreshIssue(res as Issue[]));
            })
        }
        return () => {window.removeEventListener('resize', handleResize)}
    }, []);


    const mainView = (
        <div className='mb-3'>
            <div className='d-flex flex-nowrap align-items-center '>
                <div className='h3'>
                    {openIssue?.label}
                </div>
                <div className='ms-auto'>
                    <DropdownAction 
                        actionCategory={[
                            {
                                label: 'Action',
                                value: 'action',
                                items: [
                                    
                                ]
                            }
                        ]}
                        bsIcon='three-dots'
                        handleItemClick={()=>{}}
                    />
                </div>
            </div>
            
            <div className='my-2 w-100'>
                <h6>Description</h6>
                <div className='mb-5'>
                    <TextEditor 
                        resizeProps={[boardSizes, containerRef]}
                    />
                </div>

                <div className='my-5'>
                    <Activity />
                </div>
            </div>
        </div>
    );
    return (
        <IssueViewContext.Provider value={{windowSizes}}>
            <div ref={containerRef} className=' h-100 overflow-auto' style={{minWidth: '350px'}}>
                {   
                    viewType === 2 ?
                    <Split 
                        sizes={windowSizes}
                        minSize={[500, 300]}
                        maxSize={[Infinity, 600]}
                        expandToMin={false}
                        gutterSize={10}
                        gutterAlign="center"
                        snapOffset={30}
                        dragInterval={1}
                        direction="horizontal"
                        cursor="col-resize"
                        className='h-100 d-flex flex-nowrap font-thm'
                        onDrag={(sizes) => {setWindowSizes(sizes)}}
                    >
                        <div>
                            {mainView}
                        </div>
                        <div className='ps-3'>
                            <SideView />
                        </div>
                    </Split>
                    : 
                    mainView
                }
            </div>
        </IssueViewContext.Provider>
    )
}

export default IssueView;