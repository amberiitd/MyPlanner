import { isEmpty } from 'lodash';
import { FC, useCallback, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { updateIssueBulk } from '../../../../../app/slices/issueSlice';
import { removeSprint } from '../../../../../app/slices/sprintSlice';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload, Project, SprintStatus } from '../../../../../model/types';
import { commonCrud, IssuesCrud } from '../../../../../services/api';
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
    const issueQuery = useQuery((payload: CrudPayload) => IssuesCrud(payload));
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload))
    const [{isOver}, drop] = useDrop(()=> ({
        accept: 'issue',
        drop: (item: any) => {
            props.handleDrop({itemId: item.id, cardId: props.sprintId})
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [props.handleDrop])

    const dispatch = useDispatch();

    const [storyPoints, setStoryPoints] = useState<{
        notStarted: number;
        inProgress: number;
        done: number;
    }>({
        notStarted: 0,
        inProgress: 0,
        done: 0
    });

    const handleDelete = useCallback(()=>{
        const deleteSprint = () => {
            commonQuery.trigger({
                action: 'DELETE',
                data: {
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

    useEffect(()=>{
        let notStarted = 0, inProgress =0, done =0; 
        props.issueList.forEach(issue => {
            switch(issue.stage){
                case 'not-started':
                    notStarted+= (issue.storyPoint || 0);
                    break;
                case 'in-progress':
                    inProgress+= (issue.storyPoint || 0);
                    break;
                case 'done':
                    done+= (issue.storyPoint || 0);
                    break;
                default:
                    break;
            }
        })

        setStoryPoints({notStarted, inProgress, done})
    }, [props.issueList])

    return (
        <div ref={drop} className='p-2 rounded-2 bg-light'>
            <div>
                <SprintHeaderRibbon
                    label={props.sprintName?? `${props.project.key} Sprint ${props.sprintIndex}`}
                    metric={{
                        storyPoints: [
                            {
                                stageLabel: 'Not started',
                                value: storyPoints.notStarted,
                                color: 'light'
                            },
                            {
                                stageLabel: 'In progress',
                                value: storyPoints.inProgress,
                                color: 'thm'
                            },
                            {
                                stageLabel: 'Done',
                                value: storyPoints.done,
                                color: 'green'
                            }
                        ],
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