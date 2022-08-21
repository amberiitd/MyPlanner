import { FC } from 'react';
import IssueCreator from '../IssueCreator/IssueCreator';
import IssueRibbon from '../IssueRibbon/IssueRibbon';
import './BacklogCard.css';

interface BacklogCardProps{

}

const BacklogCard: FC<BacklogCardProps> = (props) => {

    return (
        <div>
            <div>
                <div>
                    <IssueRibbon 
                        issue={{
                            id: "1",
                            type: {
                                label: 'Story',
                                value: 'story',
                                leftBsIcon: 'bookmark'
                            },
                            label: 'Test issue label',
                            project: {
                                label: 'Project 1'
                            },
                            stage: {
                                label: 'to-do'
                            }
                        }}    
                    />
                </div>
                <div>
                    <IssueCreator />
                </div>
            </div>
        </div>
    )
}

export default BacklogCard;