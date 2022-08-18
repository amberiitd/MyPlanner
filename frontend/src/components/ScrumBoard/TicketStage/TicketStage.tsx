import { clone, startCase, toString, toUpper } from 'lodash';
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import DropdownAction from '../../DropdownAction/DropdownAction';
import { ScrumContext } from '../ScrumBoard';
import TicketCard from '../TicketCard/TicketCard';
import './TicketStage.css';

interface TicketStageProps{
    tickets: any[];
    stage: string;
}

const TicketStage: FC<TicketStageProps> = (props) => {
    // const [ticketBucket, setTicketBucket] = useState<any[]>(props.tickets);
    const stageRef = useRef<HTMLDivElement>(null);

    const {
        ticketList, 
        setTicketList, 
        dragTicket, setDragTicket, 
        dragSource, 
        setDragSource, 
        dropTarget, 
        setDropTarget
    } = useContext(ScrumContext);

    const [metric, setMetric] = useState<any>({});
    const [hover, setHover] = useState(false);

    const handleDragStart = useCallback( (event: any, item: any) => {
        const ticket = ticketList.find(ticket => ticket.issueId === item.issueId);
        setDragTicket(ticket) ;
        setDragSource(props.stage);
    }, [ stageRef, ticketList])

    const handleDrop = useCallback((event: any) => {
        if (dragTicket){
            setDropTarget(props.stage);
        }
    }, [dragTicket])

    const handleDragEnd = useCallback((event: any) => {
        if (dragTicket && dragSource && dropTarget && dragSource !== dropTarget){
            const index = ticketList.findIndex(t => t.issueId === dragTicket.issueId);
            dragTicket.stage = dropTarget;
            const newTicketList  = ticketList.filter((t, i) => index !==i );
            setTicketList([...newTicketList, dragTicket]);
            setDragSource(undefined);
            setDropTarget(undefined);
            setDragTicket(undefined);
        }
    }, [ticketList, dragTicket, dragSource, dropTarget])

    useEffect(()=>{
        const ticketCount = ticketList.filter(t => t.stage === props.stage).length;
        setMetric({ticketCount});
    }, [ticketList]);
    return (
        <div ref={stageRef} id="target" className='p-2 pb-3 bg-light rounded-3 ticket-stage'
            onDragOver = {(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                }}
            onDrop={(e)=> {handleDrop(e);}}
            onDragEnd = {(e) => {handleDragEnd(e)}}
        >
            <div className='d-flex flex-nowrap stage-header mb-2 p-1'
                onMouseEnter={()=> {setHover(true)}}
                onMouseLeave={()=> {setHover(false)}}
            >
                <div className='h6'>
                    {`${toUpper(startCase(props.stage))} ${metric.ticketCount} ${metric.ticketCount > 1 ? 'ISSUES': 'ISSUE'}`}
                </div>

                <div className='ms-auto' hidden={!hover}>
                    <DropdownAction 
                        menuItems={[
                            {
                                label: 'Set column limit',
                                value: 'column-limit'
                            },
                            {
                                label: 'Delete',
                                value: 'delete'
                            }
                        ]} 
                        bsIcon='three-dots'
                        handleItemClick={()=>{}}                    />
                </div>
            </div>
            {
                
                ticketList.filter(t=> t.stage === props.stage).map((item, index)=> (
                    <div id={`ticket-${props.stage}-${item.issueId}`} key={`item-${index}`} className='mb-2 border' 
                        draggable={true} 
                        onDragStart={(e)=> handleDragStart(e, item)}
                        
                    >
                        <TicketCard 
                            {...item}
                            handleMenuClick={(event: any, event2: any)=> {} } 
                            onClick={(event1: any)=> {} }                            
                        />
                    </div>
                ))
            }
            
        </div>
    )
}

export default TicketStage;