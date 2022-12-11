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
import { refreshIssue, updateIssue } from '../../../../app/slices/issueSlice';
import { Issue } from '../Backlog/IssueRibbon/IssueRibbon';
import CircleRotate from '../../../../components/Loaders/CircleRotate';
import ChildIssue from './ChildIssue/ChildIssue';

interface IssueViewProps{

}


export const IssueViewContext = createContext<{
    openIssue: Issue | undefined;
    descEditor: boolean;
    setDescEditor: (open: boolean) => void;
    newCommentEditor: boolean;
    setNewCommentEditor: (open: boolean) => void;
    commentOnEdit: string | undefined;
    setCommentOnEdit: (id: string | undefined) => void;
}>({
    openIssue: undefined,
    descEditor: false,
    setDescEditor: (open: boolean) => {},
    newCommentEditor: false,
    setNewCommentEditor: (open: boolean) => {},
    commentOnEdit: undefined,
    setCommentOnEdit: (id: string | undefined) => {}
});


const IssueView: FC<IssueViewProps> = (props) => {
    const observer = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewType, setViewType] = useState<1 | 2>(2);
    const [searchParam , setSearchParam] = useSearchParams();
    const issues = useSelector((state: RootState) => state.issues);
    const openIssue = useMemo(() => {
        return issues.values.find(issue => issue.id === searchParam.get('issueId'));
    }, [issues]);
    const [descEditor, setDescEditor] = useState(false);
    const [newCommentEditor, setNewCommentEditor] = useState(false);
    const [commentOnEdit, setCommentOnEdit] = useState<string | undefined>('');
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

    const onContainerObserve = (node: any)=>{
        if (observer.current) observer.current.disconnect();
        observer.current = new ResizeObserver((entries) => {
            handleResize();
        });
        if (node) observer.current.observe(node);
    };

    const onRefresh = () => {
        issueQuery.trigger({
            action: 'RETRIEVE',
            data: {},
            itemType: 'issue'
        } as CrudPayload)
        .then((res)=>{
            dispatch(refreshIssue(res as Issue[]));
        });
    }
    useEffect(() => {
        if (!issues.loaded){
            onRefresh();
        }
    }, []);


    const mainView = (
        <div className='mb-3 pe-2'>
            <div className='d-flex flex-nowrap align-items-center '>
                <div className='h3'>
                    {openIssue?.label}
                </div>
                <div className='mx-2'>
                    <CircleRotate loading={issueQuery.loading}
                        onReload={onRefresh}
                    />
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
                <div className='mb-5'>
                    <h6>Description</h6>
                    <TextEditor 
                        value={openIssue?.description}
                        open={descEditor}
                        onToggle={(open: boolean)=> setDescEditor(open)}
                        onSave={(value: string)=>{
                            issueQuery.trigger({
                                action: 'UPDATE',
                                data: {
                                    id: openIssue?.id || '',
                                    description: value,
                                },
                                itemType: 'issue'
                            } as CrudPayload)
                            .then(()=>{
                                dispatch(updateIssue({id: openIssue?.id || '', data: {description: value}}))
                            })
                        }}
                    />
                </div>

                {
                    openIssue?.type !== 'child' &&
                    <div className='mb-5'>
                        <ChildIssue />
                    </div>
                }
                <div className='my-5'>
                    <Activity />
                </div>
            </div>
        </div>
    );
    return (
        <IssueViewContext.Provider value={{descEditor, setDescEditor, newCommentEditor, setNewCommentEditor, openIssue, commentOnEdit, setCommentOnEdit}}>
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
                                {mainView}
                            </div>
                            <div className='ps-3 overflow-auto' style={{minWidth: '300px'}}>
                                <SideView />
                            </div>
                        </Split>
                        : 
                        mainView
                    }
                </div>
            </div>
        </IssueViewContext.Provider>
    )
}

export default IssueView;