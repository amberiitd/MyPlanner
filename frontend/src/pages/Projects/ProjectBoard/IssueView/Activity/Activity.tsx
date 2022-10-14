import { FC, useContext, useState } from 'react';
import Button from '../../../../../components/Button/Button';
import ButtonSelect from '../../../../../components/input/ButtonSelect/ButtonSelect';
import TextEditor from '../../../../../components/input/TextEditor/TextEditor';
import { SimpleAction } from '../../../../../model/types';
import { ProjectBoardContext } from '../../ProjectBoard';
import { IssueViewContext } from '../IssueView';
import './Activity.css';

interface ActivityProps{

}

const Activity: FC<ActivityProps> = (props) => {
    const boardSizes = useContext(ProjectBoardContext).windowSizes;
    const issueViewSizes = useContext(IssueViewContext).windowSizes;
    const activityOptions: SimpleAction[] = [
        {
            label: 'All',
            value: 'all'
        },
        {
            label: 'Comments',
            value: 'comments',
        },
        {
            label: 'History',
            value: 'history'
        }
    ]
    const [selectedActivity, setSelectedActivity] = useState(activityOptions[1]);

    return (
        <div className=''>
            <h6>Activity</h6>
            <div className='d-flex flex-nowrap mt-2'>
                <div className='py-1'>
                    Show: 
                </div>
                <div className='w-75 mx-2'>
                    <ButtonSelect 
                        items={activityOptions} 
                        currentSelection={selectedActivity}
                        resizeProps={[boardSizes, issueViewSizes]}
                        onToggle={(item) => {setSelectedActivity(item)}}
                    />
                </div>
            </div>
            <div>
                {
                    (selectedActivity.value === 'comments' || selectedActivity.value)  && 
                    <div className='mt-3'>
                        <Comment />
                    </div>
                }
            </div>
        </div>
    )
}

const Comment: FC = () => {
    const boardSizes = useContext(ProjectBoardContext).windowSizes;
    const issueViewSizes = useContext(IssueViewContext).windowSizes;
    return (
        <div className=''>
            <div className='d-flex flex-nowrap '>
                <div className='' style={{width: '3em'}}>
                    <button className='p-2 rounded-circle bg-thm-2 text-white' style={{width: '2.5em', height: '2.5em'}}>
                        NA
                    </button>
                </div>
                <div className='w-100'>
                    <TextEditor 
                        resizeProps={[boardSizes, issueViewSizes]}
                    />
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default Activity;