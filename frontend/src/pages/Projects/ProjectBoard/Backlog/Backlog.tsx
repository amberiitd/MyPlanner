import { isEmpty, uniqueId } from 'lodash';
import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
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
import { Project, Sprint } from '../../../../model/types';
import './Backlog.css';
import BacklogCard from './BacklogCard/BacklogCard';
import CompleteSprintModal from './CompleteSprintModal/CompleteSprintModal';
import { issueTypes } from './IssueCreator/IssueTypeSelector/issueTypes';
import { Issue } from './IssueRibbon/IssueRibbon';
import SprintCard from './SprintCard/SprintCard';
import SprintModal from './SprintModal/SprintModal';
import Split from 'react-split';

interface BacklogProps{
    project: Project;
}

export const BacklogContext = createContext<{
    openIssue: Issue | undefined;
    setOpenIssue: (issue: Issue | undefined) => void;
}>({
    openIssue: undefined,
    setOpenIssue: () => {}
})

const Backlog: FC<BacklogProps>  = (props) => {
    const sprints = useSelector((state: RootState) => state.sprints);
    const issues = useSelector((state: RootState) => state.issues);
    const [projectIssues, setProjectIssues] = useState<Issue[]>([]); 
    const [projectSprints, setProjectSprints] = useState<Sprint[]>([]);
    const [openIssue, setOpenIssue] = useState<Issue | undefined>();
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

    const backlogBody = (
        <div className='overflow-auto backlog-body pe-2' >
            { 
                projectSprints.map(sprint => (
                    <div key={uniqueId()} className='my-3'>
                        <SprintCard 
                            issueList={projectIssues.filter(issue => issue.sprintId === sprint.id && (isEmpty(filters.searchText) || issue.label.toLocaleLowerCase().startsWith(filters.searchText.toLocaleLowerCase())) && (isEmpty(filters.issueTypes) || filters.issueTypes.includes(issue.type)))}
                            sprintId={sprint.id}
                            sprintIndex={sprint.index}
                            sprintStatus={sprint.status}
                            handleDrop={handleDrop}
                            project={props.project}
                            sprintName={sprint.name}
                        />
                    </div>
                ))
            }
            <div className='my-3'>
                <BacklogCard 
                    issueList={projectIssues.filter(issue => issue.sprintId === 'backlog' && (isEmpty(filters.searchText) || issue.label.toLocaleLowerCase().startsWith(filters.searchText.toLocaleLowerCase())) && (isEmpty(filters.issueTypes) || filters.issueTypes.includes(issue.type)))}
                    handleDrop={handleDrop}
                    project={props.project}
                />
            </div>
        </div>
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='h-100' style={{paddingTop: '30px'}}>
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
                <div className='d-flex flex-nowrap align-items-center mb-3' style={{height: '50px'}}>
                    <div className='me-2'>
                        <TextInput 
                            label='Search Project' 
                            hideLabel={true}
                            value={filters.searchText}
                            rightBsIcon='search'
                            placeholder='Search backlog'
                            handleChange={(searchText: string)=>{setFilters({...filters, searchText})}}
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
                    </div>
                    <div className='d-flex flex-nowrap'>
                        <div className='filter mx-2'>
                            <MultiSelect 
                                label='Issue Type'
                                data={[
                                    {
                                        label: 'Type',
                                        items: issueTypes,
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
                <BacklogContext.Provider value={{openIssue, setOpenIssue}}>
                    {
                        openIssue ? (
                            <Split 
                                sizes={openIssue ? [50, 50]: [100]}
                                minSize={300}
                                expandToMin={false}
                                gutterSize={10}
                                gutterAlign="center"
                                snapOffset={30}
                                dragInterval={1}
                                direction="horizontal"
                                cursor="col-resize"
                                className='h-100 d-flex flex-nowrap'
                            >
                                {backlogBody}
                                <div className=''>
                                    hello
                                </div>
                            </Split>
                        ):
                        backlogBody
                    }
                    
                </BacklogContext.Provider>
                <SprintModal />
                <CompleteSprintModal />
            </div>
        </DndProvider>
    )
}

export default Backlog;