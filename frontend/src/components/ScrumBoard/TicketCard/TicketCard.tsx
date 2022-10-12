import { FC, useRef, useCallback,  useState, useContext } from 'react';
import { issueTypeMap } from '../../../pages/Projects/ProjectBoard/Backlog/IssueCreator/IssueTypeSelector/issueTypes';
import { Issue } from '../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon';
import Badge from '../../Badge/Badge';
import DropdownAction from '../../DropdownAction/DropdownAction';
import { ScrumContext } from '../ScrumBoard';
import './TicketCard.css';

interface TicketCardProps{
    issue: Issue;
    handleMenuClick: (event: any) => void;
    onClick: (event1: any) => void;
}

const TicketCard: FC<TicketCardProps> = (props) => {
    const [hover, setHover] = useState(false);
    const {
        dragTicket,
    } = useContext(ScrumContext);
    const [collapseHeight, setCollapseHeight] = useState('0px');
    return (  
        <div className='p-2 shadow-sm ticket-card text-muted grabbable'
            onMouseEnter={()=> {setHover(true)}}
            onMouseLeave={()=> {setHover(false)}}
        >
            <div className='d-flex flex-nowrap mb-1'>
                <div className='h5'>
                    {props.issue.label}
                </div>
                <div className='ms-auto' hidden={!hover}>
                    <DropdownAction 
                        actionCategory={[
                            {
                                label: 'Action',
                                value: 'action',
                                items: [],
                            }
                        ]}
                        bsIcon='three-dots'
                        handleItemClick={(menuevent: any)=>{}}
                    />
                </div>
            </div>
            <div className='d-flex flex-nowrap'>
                <div>
                    <i className={`bi bi-${ issueTypeMap[props.issue.type].leftBsIcon} me-2`}></i>
                    <span>{`${props.issue.projectKey}-${props.issue.id}`}</span>
                </div>
                <div className='ms-auto' title={`${props.issue.storyPoint} story points`}>
                    <Badge
                        data={props.issue.storyPoint || '-'}
                        extraClasses='bg-light'
                    />
                </div>
            </div>

        </div>
    )
}

export default TicketCard;

function useCallBack(arg0: (e: any) => void, arg1: number[]) {
    throw new Error('Function not implemented.');
}
