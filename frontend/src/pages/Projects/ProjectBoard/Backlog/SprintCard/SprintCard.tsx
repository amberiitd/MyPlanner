import { FC, useState } from 'react';
import { useDrop } from 'react-dnd';
import IssueCreator from '../IssueCreator/IssueCreator';
import IssueRibbon from '../IssueRibbon/IssueRibbon';
import './SprintCard.css';
import SprintHeaderRibbon from './SprintHeaderRibbon/SprintHeaderRibbon';

interface SprintCardProps{
    issueList: any[];
    sprintId: string;
    handleDrop: (event: any) => void;
}

const SprintCard: FC<SprintCardProps> = (props) => {
    const [collapse, setCollapse] = useState(false);
    const [{isOver}, drop] = useDrop(()=> ({
        accept: 'issue',
        drop: (item: any) => {
            props.handleDrop({itemId: item.id, sprintId: props.sprintId})
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))
    return (
        <div ref={drop} className='p-2 rounded-2 bg-light'>
            <div>
                <SprintHeaderRibbon
                    label={`Project 1 Sprint ${props.sprintId}`}
                    metric={{
                        storyPoints: [
                            {
                                stageLabel: 'Not started',
                                value: 0,
                                color: 'light'
                            },
                            {
                                stageLabel: 'In progress',
                                value: 2,
                                color: 'thm'
                            },
                            {
                                stageLabel: 'Done',
                                value: 3,
                                color: 'green'
                            }
                        ],
                        status: 'not-started'
                    }}
                    collapse={collapse}
                    handleClick={()=>{setCollapse(!collapse)}}
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
                    <IssueCreator />
                </div>
            </div>
        </div>
    )
}

export default SprintCard;