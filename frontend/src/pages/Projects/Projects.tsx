import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Button from '../../components/Button/Button';
import MultiSelect from '../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../components/input/TextInput/TextInput';
import Table, { ColDef, RowAction, SimpleAction } from '../../components/Table/Table';
import { Project } from '../../data/types';
import BinaryAction from '../../components/BinaryAction/BinaryAction'
import './Projects.css';
import projectModalService, { projectCreateModalService } from '../../modal.service';
import { divide } from 'lodash';
import ProjectBoard from './ProjectBoard/ProjectBoard';

interface ProjectsProps{

}

const Projects: FC<ProjectsProps> = (props) => {

    const data = [
        {
            label: 'MyPlanner Products',
            items: [
                {
                    label: 'MyPlanner Software',
                    value: 'myplanner-software'
                },
                {
                    label: 'MyPlanner Work Management',
                    value: 'myplanner-work-management'
                }
            ]
        }
    ]

    const projectList: Project[] = [
        {
            name: "Test Project 1",
            key: "test-project-1",
            leadAssignee: "Nazish Amber",
            type: 'MyPlanner Software'
        },
        {
            name: "My Project 2",
            key: "my-project-2",
            leadAssignee: "Khalid safi Ibne Batuta",
            type: 'MyPlanner Software',
            isStarred: true
        }
    ];

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
                to: '#'
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
            value: 'type'
        },
        {
            label: 'Lead',
            value: 'leadAssignee'
        }
    ];

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
        handleAction: (rowdata: any, event: SimpleAction) => {}
    }

    const projectRoot: JSX.Element = (
        <div className='p-4 px-5 project-container'>
            <div className='d-flex flex-nowrap border align-items-center mb-3'>
                <div className='h2'>
                    {'Projects'}
                </div>
                <div className='ms-auto'>
                    <Button 
                        label='Create Projects'
                        handleClick={()=> {projectModalService.setShowModel(true)}}
                    />
                </div>
            </div>
            <div className='d-flex flex-nowrap border mb-3'>
                <div className='me-3 param'>
                    <TextInput 
                    label='Search Projects'
                    hideLabel={true}
                    value={''}
                    placeholder=''
                    rightBsIcon='search'
                    handleChange={()=>{}} />
                </div>
                <div className='param'>
                    <MultiSelect 
                        label='Project Types'
                        hideLabel={true}
                        data={data}
                        onSelectionChange={()=>{}}
                    />
                </div>
            </div>
            <div>
                <Table 
                    data={projectList}
                    colDef={projectColDef}
                    actions={actions}
                />
            </div>
        </div>
    )
    return (
        <div className='h-100c'>
            <Routes>
                
                <Route path='/:projectKey/board' element={ <ProjectBoard /> } />
                <Route path='*' element={projectRoot} />
            </Routes>
        </div>
    )
}

export default Projects;