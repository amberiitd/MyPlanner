import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../../../../../app/store';
import { Issue } from '../../Backlog/IssueRibbon/IssueRibbon';
import { stages } from '../../Backlog/IssueRibbon/StageSelector/stages';
import StageSelector from '../../Backlog/IssueRibbon/StageSelector/StageSelector';
import FieldCard from './FieldCard/FieldCard';
import './SideView.css';

interface SideViewProps{

}

const SideView: FC<SideViewProps> = (props) => {
    const fields = useSelector((state: RootState) => state.userPref.value.fields)
    const [searchParam , setSearchParam] = useSearchParams();
    const issue = useSelector((state: RootState) => state.issues.values.find(issue => issue.id === searchParam.get('issueId')));

    return (
        <div className=''>
            <div className='d-flex flex-nowrap'>
                <div>
                    <StageSelector 
                        selectedStage={stages.find(stage => stage.value === issue?.stage)} 
                        issueId={issue?.id || ''} 
                        drop={'left'}
                    />
                </div>
            </div>
            <div className=''>
                <div  className='mt-2'>
                    <FieldCard 
                        label='Pinned'
                        id="pinned"
                        fields={fields.filter(field => field.fieldCardId === 'pinned')}
                    />
                </div>
                <div className='mt-2'>
                    <FieldCard 
                        label='Details'
                        id="details"
                        fields={fields.filter(field => field.fieldCardId === 'details')}
                    />
                </div>
            </div>
        </div>
    )
}

export default SideView;