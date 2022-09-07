import { FC, useState } from 'react';
import { useDrop } from 'react-dnd';
import IssueCreator from '../IssueCreator/IssueCreator';
import IssueRibbon from '../IssueRibbon/IssueRibbon';
import './BacklogCard.css';
import BacklogHeaderRibbon from './BacklogHeaderRibbon/BacklogHeaderRibbon';

interface BacklogCardProps{
    issueList: any[];
    handleDrop: (event: any) => void;
}

const BacklogCard: FC<BacklogCardProps> = (props) => {
    const [collapse, setCollapse] = useState(false);
    const [{isOver}, drop] = useDrop(()=> ({
        accept: 'issue',
        drop: (item: any) => {
            props.handleDrop({itemId: item.id, sprintId: '0'})
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))
    return (
        <div ref={drop} className='p-2 rounded-2 border'>
            <div>
                <BacklogHeaderRibbon
                    label={'Backlog'}
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
                        ]
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
                    Your backlog is empty
                </div>
                <div className='mt-1'>
                    <IssueCreator />
                </div>
            </div>
        </div>
    )
}

export default BacklogCard;