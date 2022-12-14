import { indexOf, isEmpty, sortBy, uniqueId } from 'lodash';
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { refreshIssue, updateIssue } from '../../../../app/slices/issueSlice';
import { RootState } from '../../../../app/store';
import Button from '../../../../components/Button/Button';
import DropdownAction from '../../../../components/DropdownAction/DropdownAction';
import MultiSelect from '../../../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../../../components/input/TextInput/TextInput';
import { CrudPayload, Project, Sprint } from '../../../../model/types';
import './Backlog.css';
import BacklogCard from './BacklogCard/BacklogCard';
import CompleteSprintModal from './CompleteSprintModal/CompleteSprintModal';
import { issueTypes } from './IssueCreator/IssueTypeSelector/issueTypes';
import { Issue } from './IssueRibbon/IssueRibbon';
import SprintCard from './SprintCard/SprintCard';
import SprintModal from './SprintModal/SprintModal';
import Split from 'react-split';
import { commonCrud } from '../../../../services/api';
import { useQuery } from '../../../../hooks/useQuery';
import { refreshSprint, updateSprint } from '../../../../app/slices/sprintSlice';
import CircleRotate from '../../../../components/Loaders/CircleRotate';
import { ProjectBoardContext } from '../ProjectBoard';
import { updateProject } from '../../../../app/slices/projectSlice';

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
    const {openProject} = useContext(ProjectBoardContext);
    const sprints = useSelector((state: RootState) => state.sprints);
    const issues = useSelector((state: RootState) => state.issues);
    const [openIssue, setOpenIssue] = useState<Issue | undefined>();
    const [filters, setFilters] = useState<{
        searchText: string;
        issueTypes: string[];
    }>({
        searchText: '',
        issueTypes: []
    });
    const projectSprints = useMemo(()=> sprints.values.filter(sprint => sprint.projectKey === props.project.key), [sprints, props]);
    const projectIssues = useMemo(()=> issues.values.filter(issue => issue.projectKey === props.project.key), [issues, props]);
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const dispatch = useDispatch();
    const members = [
        {
            name: 'Nazish Amber'
        },
        {
            name: 'Khalid Safi'
        }
    ];

    const handleDrop = useCallback((event: {itemId: string; cardId: string; insertIdx: number; cardIssueIds: string[]})=>{
        const issue = projectIssues.find(item => item.id === event.itemId);
        
        if (issue && issue.sprintId !== event.cardId){
            commonQuery.trigger({
                action: 'UPDATE',
                data: {sprintId: event.cardId, id: event.itemId},
                itemType: 'issue'
            } as CrudPayload)
            .then((res)=> {
                dispatch(updateIssue({id: event.itemId, data: {sprintId: event.cardId}}))
            })
        }
        if (event.insertIdx === undefined || event.insertIdx < 0) return; // check for index

        let newOrder = (event.cardIssueIds || []);
        const orderIndex = newOrder.findIndex((id) => id === event.itemId);
        if (orderIndex < 0){
            newOrder.push(event.itemId);
        }else if(orderIndex !== event.insertIdx){
            newOrder.splice(orderIndex, 1);
            newOrder.splice(event.insertIdx, 0, event.itemId);
        }
        if(event.cardId === 'backlog'){
            commonQuery.trigger({
                action: 'UPDATE',
                data: {id: openProject?.id, backlogIssueOrder: newOrder},
                itemType: 'project'
            } as CrudPayload)
            .then((res)=> {
                dispatch(updateProject({key: openProject?.key || '', data: {backlogIssueOrder: newOrder}}))
            })
        }else{
            commonQuery.trigger({
                action: 'UPDATE',
                data: {id: event.cardId, issueOrder: newOrder},
                itemType: 'sprint'
            } as CrudPayload)
            .then((res)=> {
                dispatch(updateSprint({id: event.cardId, data: {issueOrder: newOrder}}))
            })
        }
    }, [projectIssues])

    const onRefresh = () =>{
        commonQuery.trigger({
            action: 'RETRIEVE',
            data: {},
            itemType: 'sprint'
        } as CrudPayload)
        .then((res) => {
            dispatch(refreshSprint(res as Sprint[]));

            commonQuery.trigger({
                action: 'RETRIEVE',
                data: {},
                itemType: 'issue'
            } as CrudPayload)
            .then((res) => {
                dispatch(refreshIssue(res as Issue[]))
            });
        });
    }
    useEffect(()=>{
        if (!sprints.loaded || !issues.loaded){
            onRefresh();
        }
    }, [])

    const backlogBody = (
        <div className='overflow-auto backlog-body pe-2' >
            { 
                projectSprints.map(sprint => (
                    <div key={uniqueId()} className='my-3'>
                        <SprintCard 
                            issueList={
                                sortBy(
                                    projectIssues.filter(issue => issue.sprintId === sprint.id && (isEmpty(filters.searchText) || issue.label.toLocaleLowerCase().startsWith(filters.searchText.toLocaleLowerCase())) && (isEmpty(filters.issueTypes) || filters.issueTypes.includes(issue.type))),
                                    (issue) => {
                                        const index=  indexOf(sprint?.issueOrder || [], issue.id);
                                        return index >= 0 ? index: 99999;
                                    }
                                )
                            }
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
                    issueList={
                        sortBy(
                            projectIssues.filter(issue => issue.sprintId === 'backlog' && (isEmpty(filters.searchText) || issue.label.toLocaleLowerCase().startsWith(filters.searchText.toLocaleLowerCase())) && (isEmpty(filters.issueTypes) || filters.issueTypes.includes(issue.type))),
                            (issue) => {
                                const index=  indexOf(openProject?.backlogIssueOrder || [], issue.id);
                                return index >= 0 ? index: 99999;
                            }
                        )
                    }
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
                    <div className='mx-2'>
                        <CircleRotate
                            loading={commonQuery.loading}
                            onReload={onRefresh}
                        />
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
                                        extraClasses='p-1 rounded-circle btn-as-thm'
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
                                extraClasses='btn-as-light p-1 rounded-circle'
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
                                <div className='overflow-auto'>
                                    {backlogBody}
                                </div>
                                
                                <div className=''>
                                    <a href={`issue?issueId=${openIssue.id}`}>Issue View</a>
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