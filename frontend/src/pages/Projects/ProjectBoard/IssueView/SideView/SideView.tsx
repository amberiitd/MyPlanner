import { FC } from 'react';
import { useSelector } from 'react-redux';
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
    return (
        <div className=''>
            <div className='d-flex flex-nowrap'>
                <div>
                    <StageSelector 
                        selectedStage={stages[0]} 
                        issueId={''} 
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