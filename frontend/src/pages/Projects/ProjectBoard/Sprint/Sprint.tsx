import { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import BinaryAction from '../../../../components/BinaryAction/BinaryAction';
import Button from '../../../../components/Button/Button';
import DropdownAction from '../../../../components/DropdownAction/DropdownAction';
import MultiSelect from '../../../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../../../components/input/TextInput/TextInput';
import ScrumBoard from '../../../../components/ScrumBoard/ScrumBoard';
import { Project } from '../../../../model/types';
import { Issue } from '../Backlog/IssueRibbon/IssueRibbon';
import { Sprint as SprintData } from '../../../../model/types'
import './Sprint.css';
import { updateIssue } from '../../../../app/slices/issueSlice';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';

interface SprintProps{
    project: Project;
}

const Sprint: FC<SprintProps> = (props) => {
    const sprints = useSelector((state: RootState) => state.sprints);
    const issues = useSelector((state: RootState) => state.issues);
    const [projectIssues, setProjectIssues] = useState<Issue[]>([]); 
    const [projectSprints, setProjectSprints] = useState<SprintData[]>([]);
    const [filters, setFilters] = useState<{
        searchText: string;
        issueTypes: string[];
    }>({
        searchText: '',
        issueTypes: []
    })

    const dispatch = useDispatch();
    const members = [
        {
            name: 'Nazish Amber'
        },
        {
            name: 'Khalid Safi'
        }
    ];

    useEffect(() => {
        setProjectIssues(issues.values.filter(issue => issue.projectKey === props.project.key));
        setProjectSprints(sprints.values.filter(sprint => sprint.projectKey === props.project.key));
    }, [issues, sprints, props])
    return (
        <div className='h-100' >
            <div className='d-flex flex-nowrap align-items-center mb-3'>
                <div className='h3 text-cut'>
                    {`${props.project.name} ${'Sprint 1'}`}
                </div>
                <div className='ms-auto me-2'>
                    <BinaryAction 
                        label='Star' 
                        bsIcon0='star'
                        bsIcon1='star-fill' 
                        extraClasses='icon-lg'
                        handleClick={()=>{}} 
                    />
                </div>
                <div className='me-2'>
                    <Button 
                        label='Complete sprint' 
                        extraClasses='btn-as-thm px-3 py-1'
                        handleClick={()=>{}}
                    />
                </div>
                <div>
                    <DropdownAction 
                        actionCategory={[
                            {
                                label: 'Action',
                                value: 'action',
                                items: [
                                    {
                                        label: 'Edit Sprint',
                                        value: 'edit-sprint'
                                    },
                                    {
                                        label: 'Manage custom filters',
                                        value: 'manage-filters'
                                    }
                                ]
                            }
                        ]}
                        bsIcon='three-dots'
                        handleItemClick={()=>{}}
                    />
                </div>
            </div>
            <div className='d-flex flex-nowrap align-items-center mb-3' style={{height: '50px'}}>
                <div className='me-2'>
                    <TextInput 
                        label='Search Project' 
                        hideLabel={true}
                        value={filters.searchText}
                        rightBsIcon='search'
                        placeholder='Search this board'
                        handleChange={(searchText: string)=>{setFilters({...filters, searchText})}}
                    />
                </div>
                <div className='d-flex flex-nowrap'>
                    {
                        members.map((item, index)=>(
                            <div key={`members-${index}`} className='mx-1'>
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
                </div>
                <div className='d-flex flex-nowrap'>
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
                            onSelectionChange={(items)=>{
                                setFilters({
                                    ...filters, 
                                    issueTypes: items.map(item => item.value)
                                })
                            }}
                        />

                    </div>
                </div>
            </div>
            <div className='d-flex scrum-board w-100'>
                <ScrumBoard
                    tickets={projectIssues.filter(issue => (isEmpty(filters.searchText) || issue.label.toLocaleLowerCase().startsWith(filters.searchText.toLocaleLowerCase())) && (isEmpty(filters.issueTypes) || filters.issueTypes.includes(issue.type)))}
                />
            </div>
        </div>
    )
}

export default Sprint;