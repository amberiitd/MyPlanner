import { FC } from 'react';
import Button from '../../../../../components/Button/Button';
import { stages } from '../../Backlog/IssueRibbon/StageSelector/stages';
import StageSelector from '../../Backlog/IssueRibbon/StageSelector/StageSelector';
import './SideView.css';

interface SideViewProps{

}

const SideView: FC<SideViewProps> = (props) => {

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
        </div>
    )
}

export default SideView;