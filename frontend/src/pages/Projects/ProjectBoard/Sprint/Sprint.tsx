import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import BinaryAction from '../../../../components/BinaryAction/BinaryAction';
import Button from '../../../../components/Button/Button';
import DropdownAction from '../../../../components/DropdownAction/DropdownAction';
import MultiSelect from '../../../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../../../components/input/TextInput/TextInput';
import ScrumBoard from '../../../../components/ScrumBoard/ScrumBoard';
import { CrudPayload, Project, User } from '../../../../model/types';
import { Issue } from '../Backlog/IssueRibbon/IssueRibbon';
import { Sprint as SprintData } from '../../../../model/types'
import './Sprint.css';
import { refreshIssue, updateIssue } from '../../../../app/slices/issueSlice';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useQuery } from '../../../../hooks/useQuery';
import { commonCrud, projectCommonCrud } from '../../../../services/api';
import { ProjectBoardContext } from '../ProjectBoard';
import { refreshSprint } from '../../../../app/slices/sprintSlice';
import { completeSprintModalService } from '../../../../modal.service';
import InvitePeople from '../InvitePeople/InvitePeople';
import ButtonCircle from '../../../../components/ButtonCircle/ButtonCircle';
import ButtonMultiSelect from '../Backlog/ButtonMultiSelect/ButtonMultiSelect';
import { LinkItem } from '../../../../components/LinkCard/LinkCard';

interface SprintProps{
    project: Project;
}

const Sprint: FC<SprintProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const sprints = useSelector((state: RootState) => state.sprints);
    const people = useSelector((state: RootState) => state.users.values);
    const issues = useSelector((state: RootState) => state.issues);
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const activeSprints = useMemo(() => sprints.values.filter(sprint => sprint.sprintStatus === 'active'), [sprints]);
    const [filters, setFilters] = useState<{
        searchText: string;
        issueTypes: string[];
        people: LinkItem[];
    }>({
        searchText: '',
        issueTypes: [],
        people: []
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

    const projectIssues = useMemo(() => issues.values.filter(issue => issue.projectKey === props.project.key), [issues, props]);
    // const projectSprints = useMemo(() => sprints.values.filter(sprint => sprint.projectKey === props.project.key), [sprints, props])

    const onRefresh = () =>{
        projectCommonQuery.trigger({
            action: 'RETRIEVE',
            data: {projectId: openProject?.id,},
            itemType: 'sprint'
        } as CrudPayload)
        .then((res) => {
            dispatch(refreshSprint(res as SprintData[]));
        });

        projectCommonQuery.trigger({
            action: 'RETRIEVE',
            data: {projectId: openProject?.id},
            itemType: 'issue'
        } as CrudPayload)
        .then((res) => {
            dispatch(refreshIssue(res as Issue[]))
        });
    }
    useEffect(()=>{
        if (!isEmpty(openProject)){
            onRefresh();
        }
    }, [openProject])

    return (
        <DndProvider backend={HTML5Backend}>
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
                    {
                        activeSprints.length > 0 &&
                        <div className='me-2'>
                            <Button 
                                label='Complete sprint' 
                                extraClasses='btn-as-thm py-1'
                                handleClick={()=>{
                                    completeSprintModalService.setProps({
                                        sprintIds: activeSprints.map(sp => sp.id)
                                    });
                                    completeSprintModalService.setShowModel(true)
                                }}
                            />
                        </div>
                    }
                    
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
                    <div className='mx-2'>
                            <ButtonMultiSelect 
                                items={people.map(p => ({
                                    label: p.fullName,
                                    value: p.email
                                }))} 
                                selectedItems={filters.people}
                                onSelectionChange={(people) => setFilters({...filters, people})}
                            />
                        </div>
                        <div className='me-2'>
                            <InvitePeople />
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
                        issues={projectIssues
                            .filter(issue => activeSprints.findIndex(sprint => sprint.id === issue.sprintId) >= 0)
                            .filter(issue => (isEmpty(filters.searchText) || issue.label.toLocaleLowerCase().startsWith(filters.searchText.toLocaleLowerCase())) && (isEmpty(filters.issueTypes) || filters.issueTypes.includes(issue.type)) && (isEmpty(filters.people) || filters.people.findIndex(p => p.value === issue.assignee) >= 0))}
                    />
                </div>
            </div>
        </DndProvider>
    )
}

export default Sprint;