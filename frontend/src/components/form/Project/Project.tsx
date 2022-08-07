import { FC, useState } from 'react';
import Select from '../../input/Select/Select';
import './Project.css';

interface ProjectProps{

}

const Project: FC<ProjectProps> = () => {
    const data= [
        {
            label: 'Recent Projects',
            items: [
                {
                    label: 'Option 1',
                    value: 'value1',
                },
                {
                    label: 'Value 2',
                    value: 'value2',
                },
                {
                    label: 'Choice 3',
                    value: 'value3',
                },
            ],
            showLabel: true
        },
        {
            label: 'All Projects',
            items: [
                {
                    label: 'Option 1',
                    value: 'value1',
                },
                {
                    label: 'Value 2',
                    value: 'value2',
                },
                {
                    label: 'Choice 3',
                    value: 'value3',
                },
            ],
            showLabel: true
        },
    ];
    const [selectedProject, setSelectedProject] = useState<any>();
    const [filteredData, setFilteredData] = useState<any>(data);
    
    return (
        <div>
            <Select 
                label='Project'
                data={filteredData}
                isRequired={true}
                selectedItem={selectedProject}
                onSelectionChange={()=> {}}
            />
        </div>
    )
}

export default Project;