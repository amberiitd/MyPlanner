import { clone, toString } from 'lodash';
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
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

    const handleDragStart = useCallback( (event: any, item: any) => {
        const ticket = ticketList.find(ticket => ticket.issueId === item.issueId);
        const ghostEle = document.createElement('div');
        ghostEle.classList.add('dragging');
        ghostEle.innerHTML = 'I am flying';

        // Append it to `body`
        document.body.appendChild(ghostEle);
        event.dataTransfer.setDragImage(ghostEle, 0, 0);

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
            setDragTicket(undefined)
        }
    }, [ticketList, dragTicket, dragSource, dropTarget])

    useEffect(()=>{
    }, [ticketList]);
    return (
        <div ref={stageRef} id="target" className='p-2 pb-3 bg-light rounded-3 ticket-stage'
            // onDragOver = {(e) => {
            //     e.stopPropagation();
            //     e.preventDefault();
            //     e.dataTransfer.dropEffect = "move";
            //     }}
            // onDrop={(e)=> {handleDrop(e);}}
            // onDragEnd = {(e) => {handleDragEnd(e)}}
        >
            {
                
                ticketList.filter(t=> t.stage === props.stage).map((item, index)=> (
                    <div id={`ticket-${props.stage}-${item.issueId}`} key={`item-${index}`} className='mb-2' 
                        // draggable={true} 
                        // onDragStart={(e)=> handleDragStart(e, item)}
                        
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