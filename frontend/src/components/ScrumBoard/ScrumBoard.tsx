import { createContext, FC, useContext, useEffect, useState } from 'react';
import { Issue } from '../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon';
import { StageValue } from '../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/StageSelector/stages';
import './ScrumBoard.css';
import TicketStage from './TicketStage/TicketStage';

interface ScrumBoardProps{
    tickets: Issue[];
}

export const ScrumContext = createContext<{
    ticketList: Issue[]; 
    setTicketList: (event: Issue[]) => void;
    dragTicket: Issue |undefined;
    setDragTicket: (ticket: Issue | undefined) => void;
    dragSource: StageValue | undefined;
    setDragSource: (event: StageValue | undefined) => void;
    dropTarget: StageValue | undefined;
    setDropTarget: (event: StageValue | undefined) => void;
}>({ 
    ticketList: [],
    setTicketList: () => {},
    dragTicket: undefined, 
    setDragTicket: ()=> {},
    dragSource: undefined,
    setDragSource: () => {},
    dropTarget: undefined,
    setDropTarget: () => {} 
});

const ScrumBoard: FC<ScrumBoardProps> = (props) => {

    const [dragTicket, setDragTicket] = useState<Issue>();
    const [dragSource, setDragSource] = useState<StageValue | undefined>();
    const [dropTarget, setDropTarget] = useState<StageValue | undefined>();
    const [ticketList, setTicketList] = useState<Issue[]>([]);
    useEffect(()=>{
        setTicketList(props.tickets)
    }, [props]);
    return (
        <ScrumContext.Provider value={{ticketList, setTicketList, dragTicket, setDragTicket, dragSource, setDragSource, dropTarget, setDropTarget}}>
            <div className='d-flex w-100 h-100 py-2 overflow-auto'>
                <div className='h-100'>
                    <TicketStage 
                        stage='not-started'
                    />
                </div>
                <div className='h-100 ms-2'>
                    <TicketStage 
                        stage='in-progress'
                    />
                </div>
                <div className='h-100 ms-2'>
                    <TicketStage 
                        stage='done'
                    />
                </div>
            </div>
        </ScrumContext.Provider>
        
    )
}

export default ScrumBoard;