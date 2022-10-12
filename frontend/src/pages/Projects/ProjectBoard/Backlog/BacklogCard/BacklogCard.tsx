import { FC, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Project } from '../../../../../model/types';
import IssueCreator from '../IssueCreator/IssueCreator';
import IssueRibbon, { Issue } from '../IssueRibbon/IssueRibbon';
import './BacklogCard.css';
import BacklogHeaderRibbon from './BacklogHeaderRibbon/BacklogHeaderRibbon';

interface BacklogCardProps{
    issueList: Issue[];
    handleDrop: (event: any) => void;
    project: Project;
}

const BacklogCard: FC<BacklogCardProps> = (props) => {
    const [collapse, setCollapse] = useState(false);
    const [{isOver}, drop] = useDrop(()=> ({
        accept: 'issue',
        drop: (item: any) => {
            props.handleDrop({itemId: item.id, cardId: 'backlog'})
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [props.handleDrop])

    const [storyPoints, setStoryPoints] = useState<{
        notStarted: number;
        inProgress: number;
        done: number;
    }>({
        notStarted: 0,
        inProgress: 0,
        done: 0
    });

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
        <div ref={drop} className='backlog-card p-2 rounded-2 border'>
            <div>
                <BacklogHeaderRibbon
                    label={`Backlog`}
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
                        issueCount: props.issueList.length
                    }}
                    collapse={collapse}
                    handleClick={()=>{setCollapse(!collapse)}}
                    project={props.project}
                />
            </div>
            <div className='mt-2' hidden={collapse}>
                {
                    props.issueList.map((issue, index)=> (
                        <div className='mb-1' key={`issue-${index}`}>
                            <IssueRibbon 
                                issue={issue}    
                            />
                        </div>
                    ))
                }
                <div className='drop-space text-center py-2' hidden={props.issueList.length > 0}>
                    Your backlog is empty
                </div>
                <div className='mt-1'>
                    <IssueCreator 
                        project={props.project}
                        cardId={'backlog'}
                    />
                </div>
            </div>
        </div>
    )
}

export default BacklogCard;