import { FC, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from '../../../../components/Button/Button';
import DropdownAction from '../../../../components/DropdownAction/DropdownAction';
import MultiSelect from '../../../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../../../components/input/TextInput/TextInput';
import './Backlog.css';
import BacklogCard from './BacklogCard/BacklogCard';
import SprintCard from './SprintCard/SprintCard';

interface BacklogProps{

}

const Backlog: FC<BacklogProps>  = (props) => {
    const members = [
        {
            name: 'Nazish Amber'
        },
        {
            name: 'Khalid Safi'
        }
    ];

    const [issueList, setIssueList]  = useState([
        {
            id: "1",
            type: {
                leftBsIcon: 'bookmark'
            },
            label: 'Test Issue 1',
            project: {
                label: 'Project 1'
            },
            storyPoint: 2,
            stage: {
                label: 'to-do'
            },
            sprintId: "1"
        },
        {
            id: "2",
            type: {
                leftBsIcon: 'bookmark'
            },
            label: 'Test Issue 2',
            project: {
                label: 'Project 1'
            },
            storyPoint: 2,
            stage: {
                label: 'to-do'
            },
            sprintId: "2"
        },
        {
            id: "3",
            type: {
                leftBsIcon: 'bookmark'
            },
            label: 'Test Issue 3',
            project: {
                label: 'Project 1'
            },
            storyPoint: 2,
            stage: {
                label: 'to-do'
            },
            sprintId: "3"
        },
        {
            id: "4",
            type: {
                leftBsIcon: 'bookmark'
            },
            label: 'Test Issue 4',
            project: {
                label: 'Project 1'
            },
            storyPoint: 2,
            stage: {
                label: 'to-do'
            },
            sprintId: "0"
        }

    ])

    const handleDrop = (event: {itemId: string; sprintId: string})=>{
        const index = issueList.findIndex(item => item.id === event.itemId);
        if (index >= 0){
            issueList[index].sprintId = event.sprintId;
            setIssueList([...issueList]);
        }
    }

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
                                <div className='mx-1'>
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
                    <div className='my-3'>
                        <SprintCard 
                            issueList={issueList.filter(item => item.sprintId === '1')}
                            sprintId='1'
                            handleDrop={handleDrop}
                        />
                    </div>
                    <div className='my-3'>
                        <SprintCard 
                            issueList={issueList.filter(item => item.sprintId === '2')}
                            sprintId='2'
                            handleDrop={handleDrop}
                        />
                    </div>
                    <div className='my-3'>
                        <SprintCard 
                            issueList={issueList.filter(item => item.sprintId === '3')}
                            sprintId='3'
                            handleDrop={handleDrop}
                        />
                    </div>
                    <div className='my-3'>
                        <BacklogCard 
                            issueList={issueList.filter(item => item.sprintId === '0')}
                            handleDrop={handleDrop}
                        />
                    </div>
                </div>
                
            </div>
        </DndProvider>
    )
}

export default Backlog;