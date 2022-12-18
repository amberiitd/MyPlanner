import { FC, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../../../../../app/store';
import { Issue } from '../../Backlog/IssueRibbon/IssueRibbon';
import { stages } from '../../Backlog/IssueRibbon/StageSelector/stages';
import StageSelector from '../../Backlog/IssueRibbon/StageSelector/StageSelector';
import { ProjectBoardContext } from '../../ProjectBoard';
import FieldCard from './FieldCard/FieldCard';
import './SideView.css';

interface SideViewProps{
    issue: Issue | undefined;
}

const SideView: FC<SideViewProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const userPrefs = useSelector((state: RootState) => state.userPrefs.values);
    const [searchParam , setSearchParam] = useSearchParams();
    const projectUserPref = useMemo(()=> userPrefs.find(pref => pref.projectId === openProject?.id), [openProject]);
    return (
        <div className=''>
            <div className='d-flex flex-nowrap'>
                <div>
                    <StageSelector 
                        selectedStage={stages.find(stage => stage.value === props?.issue?.stage)} 
                        issueId={props?.issue?.id || ''} 
                        drop={'left'}
                    />
                </div>
            </div>
            <div className=''>
                <div  className='mt-2'>
                    <FieldCard 
                        label='Pinned'
                        id="pinned"
                        fields={(projectUserPref?.issueFields || []).filter(field => field.fieldCardId === 'pinned')}
                    />
                </div>
                <div className='mt-2'>
                    <FieldCard 
                        label='Details'
                        id="details"
                        fields={(projectUserPref?.issueFields || []).filter(field => field.fieldCardId === 'details')}
                    />
                </div>
            </div>
        </div>
    )
}

export default SideView;