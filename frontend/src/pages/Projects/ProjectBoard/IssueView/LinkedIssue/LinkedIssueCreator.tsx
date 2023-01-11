import { isEmpty, uniqueId } from 'lodash';
import { FC, useContext, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { updateIssue } from '../../../../../app/slices/issueSlice';
import { RootState } from '../../../../../app/store';
import Button from '../../../../../components/Button/Button';
import Select from '../../../../../components/input/Select/Select';
import { useQuery } from '../../../../../hooks/useQuery';
import { SimpleAction, CrudPayload, linkedIssueCategories } from '../../../../../model/types';
import { projectCommonCrud } from '../../../../../services/api';
import { issueTypeMap } from '../../Backlog/IssueCreator/IssueTypeSelector/issueTypes';
import { ProjectBoardContext } from '../../ProjectBoard';
import { IssueViewContext } from '../IssueView';

interface LinkedIssueCreatorProps{
    onCancel: () => void;
}

const LinkedIssueCreator: FC<LinkedIssueCreatorProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const {openIssue} = useContext(IssueViewContext);
    const [selectedIssueOption, setSelectedIssueOption] = useState<SimpleAction>();
    const [selectedCatg, setSelectedCatg] = useState<SimpleAction>();

    const issues = useSelector((state: RootState) => state.issues.values.filter(issue => !isEmpty(issue.id)));
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const dispatch = useDispatch();

    const handleNew = () =>{
        const issue = issues.find(issue => issue.id === selectedIssueOption?.value);
        if(!issue || isEmpty(selectedCatg)) return;
        let linkedIssues = {...(openIssue?.linkedIssues || {})};
        linkedIssues[selectedCatg?.value || 'relatedTo'] = [...(linkedIssues[selectedCatg?.value || 'relatedTo'] || []), issue.id];
        projectCommonQuery.trigger({
            action: 'UPDATE',
            data: {
                projectId: openProject?.id,
                id: openIssue?.id,
                linkedIssues
            },
            itemType: 'issue'
        } as CrudPayload)
        .then(()=>{
            dispatch(updateIssue({id: openIssue?.id || '', data: {
                linkedIssues
            }}));
            props.onCancel();
        })
    }
    return (
        <div className=''>
            <div className='d-flex'>
                <div className='w-25 me-2'>
                    <Select 
                        label='Linked issue category'
                        hideLabel={true}
                        selectedItem={selectedCatg}
                        data={[{
                            label: 'Category',
                            items: linkedIssueCategories.map(cat => ({
                                label: cat,
                                value: cat
                            })),
                            showLabel: false
                        }]}
                        extraClasses='bg-as-light border'
                        onSelectionChange={(item: any)=>{
                            setSelectedCatg(item)
                        }}
                        focus
                    />
                </div>
                <div className='w-75'>
                    <Select 
                        label='Issues'
                        hideLabel={true}
                        selectedItem={selectedIssueOption}
                        data={[{
                            label: 'Issues',
                            items: issues.map(issue => ({label: issue.label, value: issue.id, leftBsIcon: issueTypeMap[issue.type]?.leftBsIcon})),

                            showLabel: false
                        }]}
                        hideToggleIcon={true}
                        extraClasses='bg-as-light border'
                        onSelectionChange={(item: any)=>{
                            setSelectedIssueOption(item)
                        }}
                    />
                </div>
            </div>
            <div className='d-flex flex-nowrap my-2'>
                <div className='ms-auto'>
                    <Button 
                        disabled={isEmpty(selectedIssueOption?.value)}
                        label={'Add'}
                        handleClick={handleNew}                        
                    />
                </div>
                <div className='ms-2'>
                    <Button 
                        label={'Cancel'} 
                        extraClasses='btn-as-light  p-1'
                        handleClick={props.onCancel}                        
                    />
                </div>
            </div>
        </div>
    )
}

export default LinkedIssueCreator;