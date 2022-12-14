import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { removeIssue, updateIssue } from '../../../../../app/slices/issueSlice';
import { RootState } from '../../../../../app/store';
import Badge from '../../../../../components/Badge/Badge';
import DropdownAction from '../../../../../components/DropdownAction/DropdownAction';
import NumberBadge from '../../../../../components/NumberBadge/NumberBadge';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload, EMPTY_PROJECT } from '../../../../../model/types';
import { commonCrud } from '../../../../../services/api';
import { ProjectBoardContext } from '../../ProjectBoard';
import { BacklogContext } from '../Backlog';
import { issueTypeMap, IssueTypeValue } from '../IssueCreator/IssueTypeSelector/issueTypes';
import AssigneeSelector from './AssigneeSelector/AssigneeSelector';
import './IssueRibbon.css';
import { StageValue, stageMap } from './StageSelector/stages';
import StageSelector from './StageSelector/StageSelector';

export interface Issue{
    id: string;
    type: IssueTypeValue;
    label: string;
    projectKey: any;
    sprintId: string;
    storyPoint?: number;
    assignee?: any;
    description?: string;
    stage: StageValue;
    comments?: any[];
    parentIssueId?: string;
}

interface IssueRibbonProps{
    issue: Issue;
    cardIndex: number;
    onColDrop?: (event: any) => void;
}

const IssueRibbon: FC<IssueRibbonProps> = (props) => {
    const projects = useSelector((state: RootState) => state.projects);
    const sprints = useSelector((state: RootState) => state.sprints);
    const dispatch = useDispatch();

    const {openIssue, setOpenIssue} = useContext(BacklogContext);

    const{openProject}= useContext(ProjectBoardContext);
    const issueQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const [{isDragging, didDrop}, drag] = useDrag(()=>({
        type: "issue",
        item: props.issue,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            didDrop: !!monitor.didDrop()
        })
    }))

    const [{isOverCol}, dropInCol] = useDrop(()=> ({
        accept: 'issue',
        drop: (item: any, monitor) => {
            (props.onColDrop || (()=>{}))({itemId: item.id, insertIdx: props.cardIndex});
        },
        collect: (monitor) => ({
            isOverCol: !!monitor.isOver()
        })
    }), [])

    const handleAction = useCallback((event: any) => {
        switch(event.category){
            case 'actions':
                switch(event.item.value){
                    case 'delete':
                        const payload: CrudPayload = {
                            action: 'DELETE',
                            data: {
                                id: props.issue.id
                            },
                            itemType: 'issue'
                        }
                        issueQuery.trigger(payload)
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
                        id: props.issue.id,
                        sprintId: event.item.value
                    },
                    itemType: 'issue'
                }
                issueQuery.trigger(payload)
                .then((res) => {dispatch(updateIssue({id: props.issue.id, data: {sprintId: event.item.value}}));})
                
                break;
        }
    }, [props]);

    return (
        <div ref={drag} className='position-relative'>
            <div ref={dropInCol} className='w-100 h-100 position-absolute' style={{bottom: '0'}}>
                <div className={`w-100 pb-1 ${isOverCol? 'bg-thm-2': ''}`}>

                </div>
            </div>
            
            <div className='d-flex flex-nowrap align-items-center border rounded bg-white w-100 p-2 ribbon' style={isDragging? {opacity: 0.5}: {}}>
                <div className='mx-1'>
                    <i className={`bi bi-${issueTypeMap[props.issue.type].leftBsIcon}`}></i>
                </div>
                <div className='mx-1 text-cut'>
                    {openProject?.key}-{props.issue.id}
                </div>
                <div className='mx-1 cursor-pointer text-cut' onClick={() => {setOpenIssue(props.issue)}} style={{zIndex: 10}}>
                    {props.issue.label}
                </div>

                <div className='ms-auto ' style={{zIndex: 10}}>
                    <NumberBadge
                        data={props.issue.storyPoint}
                        extraClasses='bg-light'
                        inputClasses='input-sm'
                        onValueChange={(value: number)=>{
                            issueQuery.trigger({
                                action: 'UPDATE',
                                data: {id: props.issue.id, storyPoint: value},
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
                        selectedStage={(openProject?.scrumBoard.stages || []).find(stage => stage.value === props.issue.stage)}
                        issueId={props.issue.id}
                    />
                </div>
                <div>
                    <AssigneeSelector
                    />
                </div>
                <div>
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
                </div>

            </div>
        </div>
    )
}

export default IssueRibbon;