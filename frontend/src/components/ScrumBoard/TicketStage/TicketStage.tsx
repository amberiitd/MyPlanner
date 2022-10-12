import { clone, startCase, toString, toUpper } from 'lodash';
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateIssue } from '../../../app/slices/issueSlice';
import { StageValue } from '../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/StageSelector/stages';
import DropdownAction from '../../DropdownAction/DropdownAction';
import WindowSlider from '../../WindowSlider/WindowSlider';
import { ScrumContext } from '../ScrumBoard';
import TicketCard from '../TicketCard/TicketCard';
import './TicketStage.css';

interface TicketStageProps{
    stage: StageValue;
}

const TicketStage: FC<TicketStageProps> = (props) => {
    // const [ticketBucket, setTicketBucket] = useState<any[]>(props.tickets);
    const stageRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

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
        const ticket = ticketList.find(ticket => ticket.id === item.id);
        setDragTicket(ticket) ;
        setDragSource(props.stage);
        
        const img = document.createElement("div");
        img.id = 'drag-img'
        img.innerHTML = event.target.innerHTML;
        document.body.appendChild(img);

        var rect = event.target.getBoundingClientRect();
        var x = event.clientX - rect.left; //x position within the element.
        var y = event.clientY - rect.top; 
        event.dataTransfer.setDragImage(img, 2*x, 2*y);
    }, [ ticketList])

    const handleDrop = useCallback((event: any) => {
        if (dragTicket){
            setDropTarget(props.stage);
        }
    }, [dragTicket])

    const handleDragEnd = useCallback((event: any) => {

        var img = document.getElementById("drag-img");
        if (img?.parentNode) {
            img.parentNode.removeChild(img);
        }

        if (dragTicket && dragSource && dropTarget && dragSource !== dropTarget){
            const ticket = ticketList.find(t => t.id === dragTicket.id);
            if (ticket){
                dispatch(updateIssue({id: ticket.id, data: {stage: dropTarget}}))
            }
            setDragSource(undefined);
            setDropTarget(undefined);
            setDragTicket(undefined);
        }
        else{
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
        <div ref={stageRef} id="target" className='p-2 pb-3 bg-light rounded-3 ticket-stage overflow-auto'
            onDragOver = {(e) => {
                // e.stopPropagation();
                e.preventDefault();
            }}
            onDrop={(e)=> {handleDrop(e);}}
            onDragEnd = {(e) => {handleDragEnd(e)}}
        >
            <div className='d-flex flex-nowrap stage-header mb-2 p-1'
                onMouseEnter={()=> {setHover(true)}}
                onMouseLeave={()=> {setHover(false)}}
            >
                <div className='h6'>
                    {`${toUpper(startCase(props.stage as any))} ${metric.ticketCount} ${metric.ticketCount > 1 ? 'ISSUES': 'ISSUE'}`}
                </div>

                <div className='ms-auto' hidden={!hover}>
                    <DropdownAction 
                        actionCategory={[
                            {
                                label: 'Action',
                                value: 'action',
                                items: [
                                    {
                                        label: 'Set column limit',
                                        value: 'column-limit'
                                    },
                                    {
                                        label: 'Delete',
                                        value: 'delete'
                                    }
                                ],
                            }
                        ]}
                        bsIcon='three-dots'
                        handleItemClick={()=>{}}                    />
                </div>
            </div>
            {
                
                ticketList.filter(t=> t.stage === props.stage).map((item, index)=> (
                    <div id={`ticket-${props.stage}-${item.id}`} key={`item-${index}`} className='mb-2' 
                        draggable={true} 
                        onDragStart={(e)=> handleDragStart(e, item)}
                        style={{ opacity: dragTicket && item.id === dragTicket.id ? 0: 1}}
                    >
                        <TicketCard
                                issue={item}
                                handleMenuClick={(event: any)=> {} }                           
                                onClick={(event1: any)=> {} }                            
                            />
                    </div>
                        // <WindowSlider 
                        //     key={`item-${index}`} 
                        //     dragStartCallBack={(e)=> handleDragStart(e, item)}
                        //     children={
                                
                        //     }
                        // />
                ))
            }
            
        </div>
    )
}

export default TicketStage;