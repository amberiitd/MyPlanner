import { uniqueId } from 'lodash';
import { FC, useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeIssue, updateIssue } from '../../../../../app/slices/issueSlice';
import { RootState } from '../../../../../app/store';
import Button from '../../../../../components/Button/Button';
import DropdownAction from '../../../../../components/DropdownAction/DropdownAction';
import NumberBadge from '../../../../../components/NumberBadge/NumberBadge';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload } from '../../../../../model/types';
import { commonCrud, projectCommonCrud } from '../../../../../services/api';
import { CHILD, issueTypeMap } from '../../Backlog/IssueCreator/IssueTypeSelector/issueTypes';
import AssigneeSelector from '../../Backlog/IssueRibbon/AssigneeSelector/AssigneeSelector';
import { Issue } from '../../Backlog/IssueRibbon/IssueRibbon';
import { stageMap } from '../../Backlog/IssueRibbon/StageSelector/stages';
import StageSelector from '../../Backlog/IssueRibbon/StageSelector/StageSelector';
import { ProjectBoardContext } from '../../ProjectBoard';
import { IssueMainViewContext } from '../IssueMainView/IssueMainView';
import './ChildIssue.css';
import ChildIssueCreator from './ChildIssueCreator/ChildIssueCreator';

interface ChildIssueProps{

}

const ChildIssue: FC<ChildIssueProps> = (props) => {
    const [creator, setCreator] = useState(false);
    const {openIssue} = useContext(IssueMainViewContext);
    const childIssues = useSelector((state: RootState) => state.issues.values.filter(issue => issue.parentIssueId && (issue.parentIssueId === openIssue?.id)));
    return (
        <div>
            <div className='d-flex flex-nowrap'>
                <div className='h6'>
                    Child issue
                </div>
                <div className='ms-auto' >
                    <Button 
                        label='Create'
                        hideLabel={true}
                        rightBsIcon='plus-lg'
                        extraClasses='btn-as-light p-1 ps-2'
                        handleClick={()=>{ setCreator(true); }}
                    />
                </div>
            </div>
            <div className='mt-2'>
                {
                    childIssues.map(issue => (
                        <div key={uniqueId()}>
                            <ChildIssueRibbon 
                                issue={issue}
                            />
                        </div>
                    ))
                }
            </div>
            {
                creator &&
                <div className='mt-2'>
                    <ChildIssueCreator 
                        onCancel={() => {setCreator(false);}}
                    />
                </div>
            }
            
        </div>
    )
}

const ChildIssueRibbon: FC<{issue: Issue}> = (props) => {
    const projects = useSelector((state: RootState) => state.projects);
    const sprints = useSelector((state: RootState) => state.sprints);
    const dispatch = useDispatch();
    const {openProject} = useContext(ProjectBoardContext);
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));

    const handleAction = useCallback((event: any) => {
        switch(event.category){
            case 'actions':
                switch(event.item.value){
                    case 'delete':
                        const payload: CrudPayload = {
                            action: 'DELETE',
                            data: {
                                projectId: openProject?.id,
                                id: props.issue.id
                            },
                            itemType: 'issue'
                        }
                        projectCommonQuery.trigger(payload)
                        .then((res) => {dispatch(removeIssue({id: props.issue.id}));})
                        
                        break;
                    default:
                        break;
                }
                break;
            case 'move':
                const payload: CrudPayload = {
                    action: 'UPDATE',
                    data: {
                        projectId: openProject?.id,
                        id: props.issue.id,
                        sprintId: event.item.value
                    },
                    itemType: 'issue'
                }
                projectCommonQuery.trigger(payload)
                .then((res) => {dispatch(updateIssue({id: props.issue.id, data: {sprintId: event.item.value}}));})
                
                break;
        }
    }, [props]);

    return (
        <div className='d-flex flex-nowrap align-items-center border rounded bg-white w-100 p-2 ribbon'>
            <div className='mx-1'>
                <i className={`bi bi-${CHILD.leftBsIcon}`}></i>
            </div>
            <div className='mx-1 text-cut'>
                {openProject?.key}-{props.issue.id}
            </div>
            <a className='mx-1 cursor-pointer text-cut' href={`issue?issueId=${props.issue.id}`}>
                {props.issue.label}
            </a>

            <div className='ms-auto '>
                <NumberBadge
                    data={props.issue.storyPoint}
                    extraClasses='bg-light'
                    inputClasses='input-sm'
                    onValueChange={(value: number)=>{
                        projectCommonQuery.trigger({
                            action: 'UPDATE',
                            data: {projectId: openProject?.id, id: props.issue.id, storyPoint: value},
                            itemType: 'issue'
                        } as CrudPayload)
                        .then(()=>{
                            dispatch(updateIssue({id: props.issue.id, data: { storyPoint: value}}));
                        })
                    }}
                />
            </div>
            <div className=' ms-2'>
                <StageSelector
                    selectedStage={stageMap[props.issue.stage as any]}
                    issueId={props.issue.id}
                />
            </div>
            <div>
                <AssigneeSelector
                />
            </div>
            {/* <div>
                <DropdownAction 
                    actionCategory={[
                        {
                            label: 'ACTIONS',
                            value: 'actions',
                            items: [
                                {
                                    label: 'Add flag',
                                    value: 'add-flag',
                                },
                                {
                                    label: 'Copy issue link',
                                    value: 'copy-issue-link',
                                },
                                {
                                    label: 'Delete',
                                    value: 'delete',
                                }
                            ],
                            showLabel: true
                        },
                        {
                            label: 'MOVE TO ',
                            value: 'move',
                            items: sprints.values
                                .filter(sprint => sprint.projectKey === openProject?.key)
                                .map(sp => ({
                                    label: `${openProject?.key} Sprint ${sp.index}`,
                                    value: sp.id
                                }))
                                .concat([{
                                    label: 'Bottom of backlog',
                                    value: 'backlog'
                                }])
                            ,
                            showLabel: true
                        }
                    ]} 
                    bsIcon='three-dots'
                    handleItemClick={handleAction}
                />
            </div> */}

        </div>
    )
}

export default ChildIssue;

