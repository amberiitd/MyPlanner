import { FC, useRef, useCallback,  useState } from 'react';
import Badge from '../../Badge/Badge';
import DropdownAction from '../../DropdownAction/DropdownAction';
import './TicketCard.css';

interface TicketCardProps{
    projectInfo: {
        label: string;
        bsIcon: string;
    };
    ticketInfo: {
        label: string;
        storyPoint: number;
    };
    menuItems: any[];
    handleMenuClick: (event: any, event2: any) => void;
    onClick: (event1: any) => void;
}

const TicketCard: FC<TicketCardProps> = (props) => {
    const [hover, setHover] = useState(false);
    return (
        <div className='p-2 shadow-sm ticket-card text-muted grabbable'
            onMouseEnter={()=> {setHover(true)}}
            onMouseLeave={()=> {setHover(false)}}
        >
            <div className='d-flex flex-nowrap mb-1'>
                <div className='h5'>
                    {props.ticketInfo.label}
                </div>
                <div className='ms-auto' hidden={!hover}>
                    <DropdownAction 
                        menuItems={props.menuItems}
                        bsIcon='three-dots'
                        handleItemClick={(menuevent: any)=>{props.handleMenuClick(props.ticketInfo, menuevent)}}
                    />
                </div>
            </div>
            <div className='d-flex flex-nowrap'>
                <div>
                    <i className={`bi bi-${props.projectInfo.bsIcon} me-2`}></i>
                    <span>{props.projectInfo.label}</span>
                </div>
                <div className='ms-auto'>
                    <Badge
                        data={props.ticketInfo.storyPoint}
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
