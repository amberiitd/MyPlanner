import { FC, useCallback, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { removeIssue, updateIssue } from '../../../../../app/slices/issueSlice';
import { RootState } from '../../../../../app/store';
import Badge from '../../../../../components/Badge/Badge';
import DropdownAction from '../../../../../components/DropdownAction/DropdownAction';
import NumberBadge from '../../../../../components/NumberBadge/NumberBadge';
import { EMPTY_PROJECT } from '../../../../../model/types';
import { issueTypeMap } from '../IssueCreator/IssueTypeSelector/issueTypes';
import AssigneeSelector from './AssigneeSelector/AssigneeSelector';
import './IssueRibbon.css';
import { stageMap } from './StageSelector/stages';
import StageSelector from './StageSelector/StageSelector';

export interface Issue{
    id: string;
    type: any;
    label: string;
    projectKey: any;
    sprintId: string;
    storyPoint?: number;
    assignee?: any;
    stage: 'not-started' | 'in-progress' | 'done';
}

interface IssueRibbonProps{
    issue: Issue;
}

const IssueRibbon: FC<IssueRibbonProps> = (props) => {
    const projects = useSelector((state: RootState) => state.projects);
    const sprints = useSelector((state: RootState) => state.sprints);
    const dispatch = useDispatch();

    const[currentProject, setCurrentProject] = useState(EMPTY_PROJECT);

    const [{isDragging, didDrop}, drag] = useDrag(()=>({
        type: "issue",
        item: props.issue,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            didDrop: !!monitor.didDrop()
        })
    }))

    const handleAction = useCallback((event: any) => {
        switch(event.category){
            case 'actions':
                switch(event.item.value){
                    case 'delete':
                        dispatch(removeIssue({id: props.issue.id}));
                        break;
                    default:
                        break;
                }
                break;
            case 'move':
                dispatch(updateIssue({id: props.issue.id, data: {sprintId: event.item.value}}));
                break;
        }
    }, [props]);

    useEffect(()=> {
        setCurrentProject(projects.values.find(p => p.key === props.issue.projectKey) || EMPTY_PROJECT);
    }, [props, projects])

    return (
        <div ref={drag} className='d-flex flex-nowrap align-items-center border rounded bg-white w-100 p-2 ribbon' style={isDragging? {opacity: 0.5}: {}}>
            <div className='mx-1'>
                <i className={`bi bi-${issueTypeMap[props.issue.type].leftBsIcon}`}></i>
            </div>
            <div className='mx-1'>
                {currentProject.key}-{props.issue.id}
            </div>
            <div className='mx-1'>
                {props.issue.label}
            </div>

            <div className='ms-auto '>
                <NumberBadge
                    data={props.issue.storyPoint}
                    extraClasses='bg-light'
                    onValueChange={(value: number)=>{
                        dispatch(updateIssue({id: props.issue.id, data: { storyPoint: value}}))
                    }}
                />
            </div>
            <div className=' ms-2'>
                <StageSelector
                    selectedStage={stageMap[props.issue.stage]}
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
                                .filter(sprint => sprint.projectKey === currentProject.key)
                                .map(sp => ({
                                    label: `${currentProject.key} Sprint ${sp.index}`,
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
    )
}

export default IssueRibbon;