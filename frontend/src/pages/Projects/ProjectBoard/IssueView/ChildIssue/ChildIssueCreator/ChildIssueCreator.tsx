import { label } from 'aws-amplify';
import { isEmpty, uniqueId } from 'lodash';
import { FC, useContext, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addIssue, updateIssue } from '../../../../../../app/slices/issueSlice';
import { RootState } from '../../../../../../app/store';
import Button from '../../../../../../components/Button/Button';
import Select from '../../../../../../components/input/Select/Select';
import TextInput from '../../../../../../components/input/TextInput/TextInput';
import { useQuery } from '../../../../../../hooks/useQuery';
import { CrudPayload, SimpleAction } from '../../../../../../model/types';
import { commonCrud, projectCommonCrud } from '../../../../../../services/api';
import { Issue } from '../../../Backlog/IssueRibbon/IssueRibbon';
import { ProjectBoardContext } from '../../../ProjectBoard';
import './ChildIssueCreator.css';

interface ChildIssueCreatorProps{
    onCancel: () => void;
}

const ChildIssueCreator: FC<ChildIssueCreatorProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const [summary, setSummary] = useState('');
    const [selectedIssueOption, setSelectedIssueOption] = useState<SimpleAction>();
    const [formType, setFormType] = useState<'new' | 'existing'>('new');
    const issues = useSelector((state: RootState) => state.issues.values.filter(issue => !isEmpty(issue.id)));
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const [searchParam , setSearchParam] = useSearchParams();
    const openIssue = useMemo(() => {
        return issues.find(issue => issue.id === searchParam.get('issueId'));
    }, [issues]);
    const dispatch = useDispatch();

    const handleNew = () =>{
        if(formType === 'new'){
            if(summary.length < 3) return;
            const newIssue: Issue = {
                id: uniqueId(),
                type: 'child',
                label: summary,
                projectKey: openIssue?.projectKey,
                sprintId: openIssue?.sprintId || '',
                storyPoint: 0,
                stage: 'not-started',
                parentIssueId: openIssue?.id,
            };
            projectCommonQuery.trigger({
                action: 'CREATE',
                data: {projectId: openProject?.id, ...newIssue},
                itemType: 'issue'
            } as CrudPayload)
            .then(() => {
                dispatch(addIssue(newIssue));
                props.onCancel();
            });
        }else{
            const issue = issues.find(issue => issue.id === selectedIssueOption?.value);
            if(!issue) return;
            projectCommonQuery.trigger({
                action: 'UPDATE',
                data: {
                    projectId: openProject?.id,
                    parentIssueId: openIssue?.id
                },
                itemType: 'issue'
            } as CrudPayload)
            .then(()=>{
                dispatch(updateIssue({id: issue.id || '', data: {
                    parentIssueId: openIssue?.id
                }}));
                props.onCancel();
            })
        }
    }
    return (
        <div className=''>

            {
                formType === 'new' ?
                <div>
                    <TextInput 
                        label={''} 
                        hideLabel={true}
                        value={summary} 
                        placeholder={"What's need to be done?"}
                        handleChange={(value)=>{
                            setSummary(value);
                        }}
                        focus
                    />
                </div> :
                <div>
                    <Select 
                        label='Issues'
                        hideLabel={true}
                        selectedItem={selectedIssueOption}
                        data={[{
                            label: 'Issues',
                            items: issues.filter(issue => issue.type === 'child')
                            .map(issue => ({label: issue.label, value: issue.id})),
                            showLabel: false
                        }]}
                        hideToggleIcon={true}
                        extraClasses='bg-as-light border'
                        onSelectionChange={(item: any)=>{
                            setSelectedIssueOption(item)
                        }}
                        focus
                    />
                </div>
            }
            <div className='d-flex flex-nowrap my-2'>
                {
                    formType === 'new' &&
                    <div className='px-1 d-flex align-items-center'>
                        <div className='cursor-pointer text-muted hover-underline'
                            onClick={()=>{setFormType('existing')}}
                        >
                            <i className='bi bi-search pe-2'></i>
                            Choose an existing issue
                        </div>
                    </div>
                }
                <div className='ms-auto'>
                    <Button 
                        disabled={(formType ==='new' && summary.length < 3) || (formType === 'existing' && isEmpty(selectedIssueOption?.value))}
                        label={formType === 'new'? 'Create': 'Add'} 
                        handleClick={handleNew}                        
                    />
                </div>
                <div className='ms-2'>
                    <Button 
                        label={'Cancel'} 
                        extraClasses='btn-as-light  p-1 px-3'
                        handleClick={props.onCancel}                        
                    />
                </div>
            </div>
        </div>
    )
}

export default ChildIssueCreator;