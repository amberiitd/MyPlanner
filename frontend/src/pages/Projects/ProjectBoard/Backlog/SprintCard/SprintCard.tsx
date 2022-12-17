import { isEmpty } from 'lodash';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { updateIssueBulk } from '../../../../../app/slices/issueSlice';
import { removeSprint } from '../../../../../app/slices/sprintSlice';
import { RootState } from '../../../../../app/store';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload, Project, SprintStatus } from '../../../../../model/types';
import { commonCrud, IssuesCrud, projectCommonCrud } from '../../../../../services/api';
import { ProjectBoardContext } from '../../ProjectBoard';
import IssueCreator from '../IssueCreator/IssueCreator';
import IssueRibbon, { Issue } from '../IssueRibbon/IssueRibbon';
import './SprintCard.css';
import SprintHeaderRibbon from './SprintHeaderRibbon/SprintHeaderRibbon';

interface SprintCardProps{
    issueList: Issue[];
    sprintId: string;
    sprintIndex: number;
    sprintName: string | undefined;
    sprintStatus: SprintStatus;
    handleDrop: (event: any) => void;
    project: Project;
}

const SprintCard: FC<SprintCardProps> = (props) => {
    const [collapse, setCollapse] = useState(false);
    const {openProject} = useContext(ProjectBoardContext);
    const issueQuery = useQuery((payload: CrudPayload) => IssuesCrud(payload));
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload))
    const [{isOver}, drop] = useDrop(()=> ({
        accept: 'issue',
        drop: (item: any, monitor) => {
            if(!monitor.didDrop()){
                props.handleDrop({itemId: item.id, cardId: props.sprintId})
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [props.handleDrop])

    const dispatch = useDispatch();

    const issueIds = useMemo(()=> props.issueList.map(issue => issue.id), [props.issueList]);
    const storyPoints = useMemo(()=> (openProject?.scrumBoard.stages || []).slice(0, 3).map(stage => ({
            label: stage.label,
            value: props.issueList.reduce((pre, cur) => pre + (cur.stage === stage.value? (cur.storyPoint || 0): 0), 0)
       })) , [props.issueList, props.sprintId]);

    const handleDelete = useCallback(()=>{
        const deleteSprint = () => {
            projectCommonQuery.trigger({
                action: 'DELETE',
                data: {
                    projectId: openProject?.id,
                    id: props.sprintId,
                },
                itemType: 'sprint'
            } as CrudPayload)
            .then(()=> {
                dispatch(removeSprint({id: props.sprintId}));
            })
        };

        const ids = props.issueList.map(issue => issue.id);
        if (isEmpty(ids)){
            deleteSprint();
        }else{
            issueQuery.trigger({
                action: 'ASSIGN_SPRINT',
                data: {
                    ids,
                    sprintId: 'backlog'
                }
            } as CrudPayload)
            .then(()=>{
                dispatch(updateIssueBulk({
                    ids,
                    data: {
                        sprintId: 'backlog'
                    }
                }));
                deleteSprint();
            });
        }
        
    }, [props.issueList, props.sprintId]);

    return (
        <div ref={drop} className='p-2 rounded-2 bg-light'>
            <div>
                <SprintHeaderRibbon
                    label={props.sprintName?? `${props.project.key} Sprint ${props.sprintIndex}`}
                    metric={{
                        storyPoints: storyPoints,
                        status: props.sprintStatus,
                        issueCount: props.issueList.length
                    }}
                    sprintId={props.sprintId}
                    collapse={collapse}
                    handleClick={()=>{setCollapse(!collapse)}}
                    handleDelete={handleDelete}
                />
            </div>
            <div className='mt-2' hidden={collapse}>
                {
                    props.issueList.map((issue, index)=> (
                        <div className='mb-1' key={issue.id}>
                            <IssueRibbon 
                                issue={issue}  
                                cardIndex={index}  
                                onColDrop={(event)=>{
                                    props.handleDrop({
                                        ...event, 
                                        cardId: props.sprintId, 
                                        cardIssueIds: issueIds
                                    })
                                }}
                            />
                        </div>
                    ))
                }
                <div className='drop-space text-center py-2' hidden={props.issueList.length > 0}>
                    Add an issue by dragging the issue here
                </div>
                <div className='mt-1'>
                    <IssueCreator project={props.project} cardId={props.sprintId}/>
                </div>
            </div>
        </div>
    )
}

export default SprintCard;