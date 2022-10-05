import { uniqueId } from 'lodash';
import { FC, useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updateIssue } from '../../../../app/slices/issueSlice';
import { RootState } from '../../../../app/store';
import Button from '../../../../components/Button/Button';
import DropdownAction from '../../../../components/DropdownAction/DropdownAction';
import MultiSelect from '../../../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../../../components/input/TextInput/TextInput';
import { sprintModalService } from '../../../../modal.service';
import { Project, Sprint } from '../../../../model/types';
import './Backlog.css';
import BacklogCard from './BacklogCard/BacklogCard';
import { Issue } from './IssueRibbon/IssueRibbon';
import SprintCard from './SprintCard/SprintCard';
import SprintModal from './SprintModal/SprintModal';

interface BacklogProps{
    project: Project;
}

const Backlog: FC<BacklogProps>  = (props) => {
    const sprints = useSelector((state: RootState) => state.sprints);
    const issues = useSelector((state: RootState) => state.issues);
    const [projectIssues, setProjectIssues] = useState<Issue[]>([]); 
    const [projectSprints, setProjectSprints] = useState<Sprint[]>([]);
    const dispatch = useDispatch();
    const members = [
        {
            name: 'Nazish Amber'
        },
        {
            name: 'Khalid Safi'
        }
    ];

    const handleDrop = useCallback((event: {itemId: string; cardId: string})=>{
        const index = projectIssues.findIndex(item => item.id === event.itemId);
        if (index >= 0){
            dispatch(updateIssue({id: event.itemId, data: {sprintId: event.cardId}}))
        }
    }, [projectIssues])

    useEffect(() => {
        setProjectIssues(issues.values.filter(issue => issue.projectKey === props.project.key));
        setProjectSprints(sprints.values.filter(sprint => sprint.projectKey === props.project.key));
    }, [issues, sprints, props])

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='h-100'>
                <div className='d-flex flex-nowrap align-items-center mb-3'>
                    <div className='h3'>
                        {'Backlog'}
                    </div>
                    <div className='ms-auto'>
                        <DropdownAction 
                            actionCategory={[
                                {
                                    label: 'Action',
                                    value: 'action',
                                    items: [
                                        
                                    ]
                                }
                            ]}
                            bsIcon='three-dots'
                            handleItemClick={()=>{}}
                        />
                    </div>
                </div>
                <div className='d-flex flex-nowrap align-items-center mb-3'>
                    <div className='me-2'>
                        <TextInput 
                            label='Search Project' 
                            hideLabel={true}
                            value={''}
                            rightBsIcon='search'
                            placeholder='Search backlog'
                            handleChange={()=>{}}
                        />
                    </div>
                    <div className='d-flex flex-nowrap'>
                        {
                            members.map((item, index)=>(
                                <div key={uniqueId()} className='mx-1'>
                                    <Button
                                        label={item.name.split(' ').map(w => w[0]).join('')}
                                        extraClasses='rounded-circle circle-1 btn-as-thm'
                                        handleClick={()=>{}}
                                    />
                                </div>
                            ))
                        }
                        <div className='mx-2'>
                            <Button
                                label='Add member'
                                hideLabel={true}
                                rightBsIcon='person-plus-fill'
                                extraClasses='rounded-circle circle-1 btn-as-light'
                                handleClick={()=>{}}
                            />
                        </div>
                        <div className='filter mx-2'>
                            <MultiSelect 
                                label='Issue Type'
                                data={[
                                    {
                                        label: 'Type',
                                        items: [
                                            {
                                                label: 'Bug',
                                                value: 'bug'
                                            },
                                            {
                                                label: 'Story',
                                                value: 'story'
                                            }
                                        ],
                                        showLabel: false
                                    }
                                ]} 
                                hideLabel={true}
                                onSelectionChange={()=>{}}
                            />

                        </div>
                    </div>
                </div>
                <div className='overflow-auto backlog-body' >
                    {
                        projectSprints.map(sprint => (
                            <div key={uniqueId()} className='my-3'>
                                <SprintCard 
                                    issueList={projectIssues.filter(issue => issue.sprintId === sprint.id)}
                                    sprintId={sprint.id}
                                    sprintIndex={sprint.index}
                                    sprintStatus={sprint.status}
                                    handleDrop={handleDrop}
                                    project={props.project}
                                />
                            </div>
                        ))
                    }
                    <div className='my-3'>
                        <BacklogCard 
                            issueList={issues.values.filter(item => item.sprintId === 'backlog')}
                            handleDrop={handleDrop}
                            project={props.project}
                        />
                    </div>
                </div>
                <SprintModal />
            </div>
        </DndProvider>
    )
}

export default Backlog;