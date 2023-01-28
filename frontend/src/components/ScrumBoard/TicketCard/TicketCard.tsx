import { FC, useRef, useCallback,  useState, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { issueTypeMap } from '../../../pages/Projects/ProjectBoard/Backlog/IssueCreator/IssueTypeSelector/issueTypes';
import { Issue } from '../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon';
import Badge from '../../Badge/Badge';
import ButtonCircle from '../../ButtonCircle/ButtonCircle';
import DropdownAction from '../../DropdownAction/DropdownAction';
import { ScrumContext } from '../ScrumBoard';
import './TicketCard.css';

interface TicketCardProps{
    index: number;
    issue: Issue;
    handleMenuClick: (event: any) => void;
    onClick: (event1: any) => void;
    onTicketDrop: (event: any)=>void;
}

const TicketCard: FC<TicketCardProps> = (props) => {
    const [hover, setHover] = useState(false);
    const [{isDragging, didDrop}, drag] = useDrag(()=>({
        type: "issue",
        item: props.issue,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            didDrop: !!monitor.didDrop()
        })
    }))
    const people = useSelector((state: RootState) => state.users.values);

    const [{isOver}, drop] = useDrop(()=> ({
        accept: 'issue',
        drop: (item: any, monitor) => {
            if(!monitor.didDrop()){
                props.onTicketDrop({itemId: item.id, insertIdx: props.index});
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [])
        
    return (  
        <div ref={drag} className='p-2 shadow-sm ticket-card text-muted grabbable draggable'
            onMouseEnter={()=> {setHover(true)}}
            onMouseLeave={()=> {setHover(false)}}
            style={{opacity: isDragging? 0: 1}}
        >
            <div className={`w-100 p-1 ${isOver && !isDragging? 'bg-thm-2': ''}`}></div>

            <div ref={drop} className=''>
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
                            buttonClass='btn-as-bg p-1 px-2'
                            handleItemClick={(menuevent: any)=>{}}
                        />
                    </div>
                </div>
                <div className='d-flex flex-nowrap align-items-center'>
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
                    <div className='ms-1'>
                        <ButtonCircle
                            label={people.find(p => p.email === props.issue.assignee)?.fullName.split(' ').map(p => p[0]).join('') || 'P'}
                            showLabel={true}
                            bsIcon={'person-fill'}
                            size='sm'
                            extraClasses='p-1 rounded-circle btn-as-thm'
                            onClick={()=>{}}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TicketCard;

function useCallBack(arg0: (e: any) => void, arg1: number[]) {
    throw new Error('Function not implemented.');
}
