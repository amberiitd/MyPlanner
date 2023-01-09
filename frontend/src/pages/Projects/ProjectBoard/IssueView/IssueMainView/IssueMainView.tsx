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
import { commonCrud, projectCommonCrud } from '../../../../../services/api';
import { useDispatch } from 'react-redux';
import { refreshIssue, updateIssue } from '../../../../../app/slices/issueSlice';
import { Issue } from '../../Backlog/IssueRibbon/IssueRibbon';
import CircleRotate from '../../../../../components/Loaders/CircleRotate';
import ChildIssue from './../ChildIssue/ChildIssue';
import { isEmpty } from 'lodash';
import { updateUserPref } from '../../../../../app/slices/userPrefSlice';
import { IssueViewContext } from '../IssueView';

interface IssueMainViewProps{
    onRefresh: () => void;
    issue: Issue | undefined;
}

const IssueMainView: FC<IssueMainViewProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const {openIssue, descEditor, setDescEditor} = useContext(IssueViewContext);
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const userPrefs = useSelector((state: RootState) => state.userPrefs);
    const defaultUserPrefs = useMemo(() => userPrefs.values.find(pref => pref.id === 'default'), [userPrefs]);
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const dispatch = useDispatch();

    useEffect(()=>{
        const newRecent = [...(defaultUserPrefs?.recentViewedIssues || [])];
        if (!isEmpty(props.issue?.id)){
            const index = newRecent.findIndex(p => p === props.issue?.id);
            if (index >= 0){
                newRecent.splice(index, 1);
            }
            newRecent.splice(0, 0, props.issue?.id || '');
            commonQuery.trigger({
                action: 'UPDATE',
                data: {
                    id: 'default',
                    recentViewedIssues: newRecent
                },
                itemType: 'userPref'
            } as CrudPayload)
            .then(() => {
                dispatch(updateUserPref({id: 'default', data: {recentViewedProjects: newRecent}}));
            })
        }
    }, [props.issue, openProject])

    return (

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

    )
}

export default IssueMainView;