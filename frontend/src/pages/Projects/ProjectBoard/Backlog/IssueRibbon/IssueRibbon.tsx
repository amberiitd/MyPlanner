import { FC } from 'react';
import Badge from '../../../../../components/Badge/Badge';
import DropdownAction from '../../../../../components/DropdownAction/DropdownAction';
import NumberBadge from '../../../../../components/NumberBadge/NumberBadge';
import AssigneeSelector from './AssigneeSelector/AssigneeSelector';
import './IssueRibbon.css';
import StageSelector from './StageSelector/StageSelector';

export interface Issue{
    id: string;
    type: any;
    label: string;
    project: any;
    storyPoint?: number;
    assignee?: any;
    stage: any;
}

interface IssueRibbonProps{
    issue: Issue;
}

const IssueRibbon: FC<IssueRibbonProps> = (props) => {

    return (
        <div className='d-flex flex-nowrap align-items-center border w-100 p-2 ribbon'>
            <div className='mx-1'>
                <i className={`bi bi-${props.issue.type.leftBsIcon}`}></i>
            </div>
            <div className='mx-1'>
                {props.issue.project.label}
            </div>
            <div className='mx-1'>
                {props.issue.label}
            </div>

            <div className='ms-auto '>
                <NumberBadge
                    data={1}
                    extraClasses='bg-light'
                    onValueChange={()=>{}}
                />
            </div>
            <div className=' ms-2'>
                <StageSelector
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
                            items: [
                                {
                                    label: 'PROJ2 Sprint 1',
                                    value: 'move-to-proj2-sprint-1',
                                },
                                {
                                    label: 'PROJ2 Sprint 2',
                                    value: 'move-to-proj2-sprint-2',
                                },
                                {
                                    label: 'Bottom of backlog',
                                    value: 'move-to-bottom-of-backlog',
                                }
                            ],
                            showLabel: true
                        }
                    ]} 
                    bsIcon='three-dots'
                    handleItemClick={()=>{}}
                />
            </div>

        </div>
    )
}

export default IssueRibbon;