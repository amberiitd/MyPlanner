import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Button from '../../components/Button/Button';
import MultiSelect from '../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../components/input/TextInput/TextInput';
import './Projects.css';

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

    const projectRoot: JSX.Element = (
        <div className='p-4 project-container'>
            <div className='d-flex flex-nowrap border align-items-center mb-3'>
                <div className='h2'>
                    {'Projects'}
                </div>
                <div className='ms-auto'>
                    <Button 
                        label='Create Projects'
                        handleClick={()=> {}}
                    />
                </div>
            </div>
            <div className='d-flex flex-nowrap border'>
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
        </div>
    )
    return (
        <div className='h-100c'>
            <Routes>
                
                {/* <Route path='' element={ <Navigate to='' />} /> */}
                <Route path='*' element={projectRoot} />
            </Routes>
        </div>
    )
}

export default Projects;