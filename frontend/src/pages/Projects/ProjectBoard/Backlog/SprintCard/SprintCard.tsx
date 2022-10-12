import { FC, useCallback, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { updateIssueBulk } from '../../../../../app/slices/issueSlice';
import { removeSprint } from '../../../../../app/slices/sprintSlice';
import { Project, SprintStatus } from '../../../../../model/types';
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
        dispatch(updateIssueBulk({
            ids: props.issueList.map(issue => issue.id),
            data: {
                sprintId: 'backlog'
            }
        }));
        dispatch(removeSprint({id: props.sprintId}));
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