import { indexOf, sortBy, uniqueId } from 'lodash';
import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { updateIssue } from '../../app/slices/issueSlice';
import { IssueStage } from '../../model/types';
import { Issue } from '../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon';
import { stageMap, StageValue } from '../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/StageSelector/stages';
import { ProjectBoardContext } from '../../pages/Projects/ProjectBoard/ProjectBoard';
import Button from '../Button/Button';
import './ScrumBoard.css';
import StageCreator from './StageCreator/StageCreator';
import TicketStage from './TicketStage/TicketStage';

interface ScrumBoardProps{
    issues: Issue[];
}

export const ScrumContext = createContext<{
    orderedStages: IssueStage[];
}>({
    orderedStages: []
});

const ScrumBoard: FC<ScrumBoardProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const dispatch = useDispatch();
    const orderedStages = useMemo(()=> sortBy(
        (openProject?.scrumBoard.stages || []).map((stage, index) => ({...stage, index})),
        (stage)=> {
            const index =  indexOf(openProject?.scrumBoard.stageOrder || [], stage.value);
            return index >= 0 ? index: 99999;
        }
    ), [openProject]);

    return (
        <ScrumContext.Provider value={{orderedStages}}>
            <div className='d-flex h-100  py-2 overflow-auto  pb-5 pe-5'>
                <div className='d-flex'>
                    {
                        orderedStages.map((stage, index) => (
                            <div key={uniqueId()} className='h-100 mx-1'>
                                <TicketStage 
                                    index={stage.index}
                                    issues={
                                        sortBy(
                                            props.issues.filter(issue => issue.stage === stage.value),
                                            (issue)=> {
                                                const index =  indexOf(stage.issueOrder || [], issue.id);
                                                return index >= 0 ? index: 99999;
                                            }
                                        )
                                    }
                                    stage={stage}
                                />
                            </div>
                        ))
                    }
                </div>
                <div className='px-2'>
                    <StageCreator />
                </div>
            </div>
        </ScrumContext.Provider>
        
    )
}

export default ScrumBoard;