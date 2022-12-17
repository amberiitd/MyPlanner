import { createContext, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './../IssueView.css';
import DropdownAction from '../../../../../components/DropdownAction/DropdownAction';
import TextEditor from '../../../../../components/input/TextEditor/TextEditor';
import { ProjectBoardContext } from '../../ProjectBoard';
import Activity from './../Activity/Activity';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload } from '../../../../../model/types';
import { projectCommonCrud } from '../../../../../services/api';
import { useDispatch } from 'react-redux';
import { refreshIssue, updateIssue } from '../../../../../app/slices/issueSlice';
import { Issue } from '../../Backlog/IssueRibbon/IssueRibbon';
import CircleRotate from '../../../../../components/Loaders/CircleRotate';
import ChildIssue from './../ChildIssue/ChildIssue';
import { isEmpty } from 'lodash';

interface IssueMainViewProps{
    onRefresh: () => void;
    issue: Issue | undefined;
}

export const IssueMainViewContext = createContext<{
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

const IssueMainView: FC<IssueMainViewProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const openIssue = useSelector((state: RootState) => state.issues.values.find(issue => issue.id === props.issue?.id));
    const [descEditor, setDescEditor] = useState(false);
    const [newCommentEditor, setNewCommentEditor] = useState(false);
    const [commentOnEdit, setCommentOnEdit] = useState<string | undefined>('');
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const dispatch = useDispatch();

    return (
        <IssueMainViewContext.Provider value={{descEditor, setDescEditor, newCommentEditor, setNewCommentEditor, openIssue, commentOnEdit, setCommentOnEdit}}>
            <div className='mb-3'>
                <div className='d-flex flex-nowrap align-items-center '>
                    <div className='h3'>
                        {props.issue?.label}
                    </div>
                    <div className='mx-2'>
                        <CircleRotate loading={projectCommonQuery.loading}
                            onReload={props.onRefresh}
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
                            value={props.issue?.description}
                            open={descEditor}
                            onToggle={(open: boolean)=> setDescEditor(open)}
                            onSave={(value: string)=>{
                                projectCommonQuery.trigger({
                                    action: 'UPDATE',
                                    data: {
                                        projectId: openProject?.id,
                                        id: props.issue?.id || '',
                                        description: value,
                                    },
                                    itemType: 'issue'
                                } as CrudPayload)
                                .then(()=>{
                                    dispatch(updateIssue({id: props.issue?.id || '', data: {description: value}}))
                                })
                            }}
                        />
                    </div>

                    {
                        props.issue?.type !== 'child' &&
                        <div className='mb-5'>
                            <ChildIssue />
                        </div>
                    }
                    <div className='my-5'>
                        <Activity />
                    </div>
                </div>
            </div>
        </IssueMainViewContext.Provider>
    )
}

export default IssueMainView;