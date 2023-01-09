import { isEmpty, uniqueId } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addIssue } from '../../../app/slices/issueSlice';
import { useQuery } from '../../../hooks/useQuery';
import { CrudPayload } from '../../../model/types';
import { IssueType, IssueTypeValue } from '../../../pages/Projects/ProjectBoard/Backlog/IssueCreator/IssueTypeSelector/issueTypes';
import { Issue } from '../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon';
import { projectCommonCrud } from '../../../services/api';
import Button from '../../Button/Button';
import DropdownAction from '../../DropdownAction/DropdownAction';
import AssigneeSelector from '../AssigneeSelector2/AssigneeSelector2';
import IssueTypeComponent from '../IssueType/IssueType';
import Project from '../Project/Project';
import SprintInput from '../SprintInput/SprintInput';
import StoryPoint from '../StoryPoint/StoryPoint';
import Summary from '../Summary/Summary';
import './CreateNew.css';

interface CreateNewProps{

}

interface CreateData{
    projectKey: string;
    projectId: string;
    issueType: string;
    summary: string;
    assignee: string;
    sprintId: string;
    storyPoint: number;
}

const CreateNew: FC<CreateNewProps> = (props) => {
    const defaultValues: CreateData = {
        projectKey: '',
        projectId: '',
        issueType: '',
        summary: '',
        assignee: '',
        sprintId: '',
        storyPoint: 0
    }
    const [showModal, setShowModal]= useState(false);
    const {reset, setValue, control, watch, handleSubmit, formState: {errors} } = useForm({
        defaultValues
    });
    const formValues = watch();
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const dispatch = useDispatch();
    const onSubmit = (data: CreateData) => {
        if (data.summary.length > 3){
            const newIssue: Issue = {
                id: uniqueId(),
                type: data.issueType as IssueTypeValue,
                label: data.summary,
                projectKey: data.projectKey,
                sprintId: data.sprintId || 'backlog',
                storyPoint: data.storyPoint,
                stage: 'not-started'
            };
            projectCommonQuery.trigger({
                action: 'CREATE',
                data: {projectId: data.projectId , ...newIssue},
                itemType: 'issue'
            } as CrudPayload)
            .then(()=>{
                dispatch(addIssue(newIssue));
                setShowModal(false);
            });
        }
    }
    useEffect(()=>{
        reset(defaultValues)
    }, [showModal])
    return (
        <div className='d-flex align-items-center mx-2'>
            <div className='d-none d-lg-block' >
                <Button 
                    label='Create'
                    rightBsIcon='plus-lg'
                    hideIcon={true}
                    handleClick={()=>{ setShowModal(true) }}
                />
            </div>
            <div className='d-block d-lg-none' >
                <Button 
                    label='Create'
                    hideLabel={true}
                    rightBsIcon='plus-lg'
                    extraClasses='btn-as-thm p-1 ps-2'
                    handleClick={()=>{ setShowModal(true) }}
                />
            </div>
            <Modal
                show={showModal}
                backdrop='static'
                size='lg'
                dialogClassName='modal-dialog-scrollable font-theme'
            >
                <Modal.Header className=''>
                    <div>
                        <h4>Create issue</h4>
                    </div>
                    <div className='d-flex flex-nowrap ms-auto'>
                        <DropdownAction 
                            actionCategory={[
                                {
                                    label: 'Action',
                                    value: 'action',
                                    items: [
                                        {
                                            label: 'Show Fields',
                                            value: 'fields'
                                        }
                                    ]
                                }
                            ]}
                            handleItemClick={()=> {}}
                        />
                    </div>
                    
                </Modal.Header>
                <Modal.Body>
                    <Controller 
                        rules={{
                            validate: (value) => !isEmpty(value)
                        }}
                        control={control}
                        render={(data) =>(
                            <div className='create-select mb-3'>
                                <Project 
                                    onChange={({id, key})=>{
                                        setValue('projectKey', key);
                                        setValue('projectId', id);
                                    }}
                                />
                                {
                                    errors.projectKey &&
                                    <div className='f-80 text-danger'>
                                        Project is required.
                                    </div>
                                }
                            </div>
                        )}
                        name='projectKey'
                    />
                    <Controller 
                        rules={{
                            validate: (value) => !isEmpty(value)
                        }}
                        control={control}
                        render={(data) =>(
                            <div className='create-select'>
                                <IssueTypeComponent 
                                    onChange={(value) => {setValue('issueType', value)}}
                                />
                                {
                                    errors.issueType &&
                                    <div className='f-80 text-danger'>
                                        Issue type is required.
                                    </div>
                                }
                            </div>
                        )}
                        name='issueType'
                    />
                    <hr className='my-4 text-muted'/>
                    <Controller 
                        rules={{
                            validate: (value) => {
                                console.log('summary', value);
                                return !isEmpty(value)
                            }
                        }}
                        control={control}
                        render={(data) =>(
                            <div className='mb-3'>
                                <Summary 
                                    onChange={(value) => setValue('summary', value)}
                                />
                                {
                                    errors.summary &&
                                    <div className='f-80 text-danger'>
                                        Summary is required.
                                    </div>
                                }
                            </div>
                        )}
                        name='summary'
                    />
                    <Controller
                        control={control}
                        render={(data) =>(
                            <div className='create-select mb-3'>
                                <AssigneeSelector 
                                    projectId={formValues.projectId}
                                    onSelectionChange={(value)=>{setValue('assignee', value)}}
                                />
                            </div>
                        )}
                        name='assignee'
                    />
                    <Controller
                        control={control}
                        render={(data) =>(
                            <div className='create-select mb-3'>
                                <SprintInput projectId={formValues.projectId}
                                    onChange={(value)=>{
                                        setValue('sprintId', value);
                                    }}
                                />
                            </div>
                        )}
                        name='sprintId'
                    />
                    <Controller
                        control={control}
                        render={(data) =>(
                            <div className='create-select mb-3'>
                                <StoryPoint 
                                    onChange={(value) => setValue('storyPoint', value)}
                                />
                            </div>
                        )}
                        name='storyPoint'
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className='me-auto flex-start'>Create Another Issue</div>
                    <div className='d-flex flex-nowrap'>
                        <Button 
                            label='Close'
                            extraClasses='btn-as-link px-3 py-1'
                            handleClick={()=>{ setShowModal(false) }}
                        />
                        <Button 
                            label='Create'
                            disabled={projectCommonQuery.loading}
                            handleClick={handleSubmit(onSubmit)}
                        />
                    </div>
                    
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateNew;