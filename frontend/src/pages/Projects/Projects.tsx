import { FC, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import MultiSelect from '../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../components/input/TextInput/TextInput';
import Table, { ColDef, RowAction } from '../../components/Table/Table';
import { CrudPayload, Project, SimpleAction, User } from '../../model/types';
import BinaryAction from '../../components/BinaryAction/BinaryAction'
import './Projects.css';
import projectModalService, { projectCreateModalService } from '../../modal.service';
import ProjectBoard from './ProjectBoard/ProjectBoard';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { API, Auth } from 'aws-amplify';
import { addProjectBulk, refreshProject, removeProject } from '../../app/slices/projectSlice';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { commonCrud, fetchJoinedProjects, newJoinerCall, projectsCrud } from '../../services/api';
import { useQuery } from '../../hooks/useQuery';
import CircleRotate from '../../components/Loaders/CircleRotate';
import { refreshUser } from '../../app/slices/userSlice';

interface ProjectsProps{

}

const Projects: FC<ProjectsProps> = (props) => {
    const projects = useSelector((state: RootState) => state.projects);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const projectsQuery = useQuery((payload: any)=> fetchJoinedProjects(payload));
    const joinerQuery = useQuery((payload: any)=> newJoinerCall(payload));
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects.values);
    const [searchText, setSearchText] = useState<string>('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const data = [
        {
            label: 'MyPlanner Products',
            items: [
                {
                    label: 'MyPlanner Software',
                    value: 'software-development'
                },
                {
                    label: 'MyPlanner Work Management',
                    value: 'myplanner-work-management'
                }
            ]
        }
    ]

    useEffect(()=>{
        if (isEmpty(searchText) && isEmpty(selectedTypes)){
            setFilteredProjects(projects.values)
        }else{
            setFilteredProjects(projects.values.filter(p => (p.name.toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase()) || p.key.toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase())) && (isEmpty(selectedTypes) || selectedTypes.map((type: any) => type.value).includes(p.templateType))))
        }
    }, [searchText, selectedTypes, projects])

    const projectColDef: ColDef[] = [
        {
            label: 'Starred',
            cellRenderer: (row: any) => (
                <div>
                    <BinaryAction 
                        label='Star'
                        bsIcon0='star' 
                        bsIcon1='star-fill' 
                        handleClick={()=> {}}
                    />
                </div>
            ),
            hideLabel: true,
        },
        {
            label: 'Name',
            value: 'name',
            aslink: {
                to: '#',
                hrefGetter: (key: string) => `projects/${key}/board`
            },
            sortable: true,
        },
        {
            label: 'Key',
            value: 'key',
            sortable: true,
        },
        {
            label: 'Type',
            value: 'templateType'
        },
        {
            label: 'Lead',
            value: 'leadAssignee'
        }
    ];

    const onRefresh = ()=> {
        projectsQuery.trigger({})
        .then(res => {
            dispatch(refreshProject(res as Project[]))
        });
    }

    useEffect(() => {
        if (!projects.loaded){
            onRefresh();
        }
        const inviteToken = searchParams.get('invite_token');
        if (inviteToken){
            joinerQuery.trigger({
                token: inviteToken
            })
            .then((res)=>{
                onRefresh();
            })
        }
    }, [])

    const actions: RowAction = {
        items: [
            {
                label: 'Project Settings',
                value: 'project-settings',
            },
            {
                label: 'Move to trash',
                value: 'move-to-trash'
            }
        ],
        layout: 'dropdown',
        handleAction: (rowdata: any, event: SimpleAction) => {
            if (event.value === 'move-to-trash'){
                const payload: CrudPayload = {
                    itemType: 'project',
                    action: 'DELETE',
                    data: {
                        id: rowdata.id,
                        key: rowdata.key
                    }
                }
                projectsCrud(payload)
                .then(res => {
                    const body = JSON.parse(res.body);
                    if (isEmpty(res.errorMessage) && isEmpty(body.errorMessage)){
                        dispatch(removeProject({key: rowdata.key}))
                    }else{
                        console.log(res)
                    } 
                })
                .catch(err => console.log(err))
                ;
            }
        }
            
    }

    const projectRoot: JSX.Element = (
        <div className='p-4 px-5 project-container'>
            <div className='d-flex flex-nowrap border align-items-center mb-3'>
                <div className='h2'>
                    {'Projects'}
                </div>
                <div className='mx-2'>
                    <CircleRotate loading={projectsQuery.loading}
                        onReload={onRefresh}
                    />
                </div>
                <div className='ms-auto'>
                    <Button 
                        label='Create Projects'
                        handleClick={()=> {projectModalService.setShowModel(true)}}
                    />
                </div>
            </div>
            <div className='d-flex flex-nowrap mb-3'>
                <div className='me-3 param'>
                    <TextInput 
                    label='Search Projects'
                    hideLabel={true}
                    value={searchText}
                    placeholder=''
                    rightBsIcon='search'
                    handleChange={(searchText: string)=>{
                        setSearchText(searchText)
                    }} />
                </div>
                <div className='param'>
                    <MultiSelect 
                        label='Project Types'
                        hideLabel={true}
                        data={data}
                        onSelectionChange={(types: string[])=>{
                            setSelectedTypes(types)
                        }}
                    />
                </div>
            </div>
            <div>
                <Table 
                    data={filteredProjects}
                    colDef={projectColDef}
                    actions={actions}
                />
            </div>
        </div>
    )
    return (
        <div className='h-100c'>
            <Routes>
                <Route path='/' element={projectRoot} />
                <Route path='/:projectKey/:view/*' element={ <ProjectBoard /> } />
                <Route path='*' element={<Navigate to='/'/>} />
            </Routes>
        </div>
    )
}

export default Projects;