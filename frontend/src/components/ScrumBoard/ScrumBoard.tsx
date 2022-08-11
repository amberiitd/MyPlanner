import { createContext, FC, useContext, useEffect, useState } from 'react';
import './ScrumBoard.css';
import TicketStage from './TicketStage/TicketStage';

interface ScrumBoardProps{

}

interface Ticket{
    stage: string;
    issueId: number;
    projectInfo: {
        label: string;
        bsIcon: string;
    };
    ticketInfo: {
        label: string;
        storyPoint: number;
    };
    menuItems: any[];
}

export const ScrumContext = createContext<{
    ticketList: Ticket[]; 
    setTicketList: (event: Ticket[]) => void;
    dragTicket: Ticket |undefined;
    setDragTicket: (ticket: Ticket | undefined) => void;
    dragSource: string | undefined;
    setDragSource: (event: string | undefined) => void;
    dropTarget: string | undefined;
    setDropTarget: (event: string | undefined) => void;
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
    
    const data: Ticket[] = [
        {
            stage: 'todo',
            issueId: 1,
            projectInfo: {
                label: 'Proj 1',
                bsIcon: 'x-diamond-fill'
            },
            ticketInfo: {
                label: 'Test Issue',
                storyPoint: 2
            },
            menuItems: []
        },
        {
            stage: 'dev',
            issueId: 2,
            projectInfo: {
                label: 'Proj 1',
                bsIcon: 'x-diamond-fill'
            },
            ticketInfo: {
                label: 'Test Issue 2',
                storyPoint: 15
            },
            menuItems: []
        },
        {
            stage: 'todo',
            issueId: 3,
            projectInfo: {
                label: 'Proj 1',
                bsIcon: 'x-diamond-fill'
            },
            ticketInfo: {
                label: 'Test Issue 3',
                storyPoint: 12
            },
            menuItems: []
        },
        {
            stage: 'dev',
            issueId: 4,
            projectInfo: {
                label: 'Proj 1',
                bsIcon: 'x-diamond-fill'
            },
            ticketInfo: {
                label: 'Test Issue 4',
                storyPoint: 5
            },
            menuItems: []
        }
    ];

    const [dragTicket, setDragTicket] = useState<Ticket>();
    const [dragSource, setDragSource] = useState<string | undefined>();
    const [dropTarget, setDropTarget] = useState<string | undefined>();
    const [ticketList, setTicketList] = useState<Ticket[]>(data);
    useEffect(()=>{
    }, [ticketList]);
    return (
        <ScrumContext.Provider value={{ticketList, setTicketList, dragTicket, setDragTicket, dragSource, setDragSource, dropTarget, setDropTarget}}>
            <div className='d-flex border w-100 h-100 p-5 '>
                <div className='h-100'>
                    <TicketStage 
                        tickets={ticketList.filter(item => item.stage === 'todo')}
                        stage='todo'
                    />
                </div>
                <div className='h-100 ms-2'>
                    <TicketStage 
                        tickets={ticketList.filter(item => item.stage === 'dev')}
                        stage='dev'
                    />
                </div>
            </div>
        </ScrumContext.Provider>
        
    )
}

export default ScrumBoard;