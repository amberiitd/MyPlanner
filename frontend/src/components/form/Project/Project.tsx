import { divide, toLower } from 'lodash';
import { FC, useEffect, useState } from 'react';
import Select from '../../input/Select/Select';
import LinkCard from '../../LinkCard/LinkCard';
import './Project.css';

interface ProjectProps{

}

const Project: FC<ProjectProps> = () => {
    const data= [
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
    ];
    const [selectedProject, setSelectedProject] = useState<any>();
    const [filteredData, setFilteredData] = useState<any>(data);
    
    return (
        <div>
            <Select 
                label='Project'
                dropdownElement={(
                    <div>
                        <div>
                            <LinkCard 
                                label='Recent Projects'
                                showLabel={true}
                                isLoading={false}
                                linkItems={filteredData}
                                extraClasses='quote'
                                handleClick={(value: string) => {setSelectedProject(data.find(item => item.value === value))}}
                            />
                        </div>
                        

                        <div className='mt-1'>
                            <LinkCard 
                                label='Recent Projects'
                                showLabel={true}
                                isLoading={false}
                                linkItems={filteredData}
                                extraClasses='quote'
                                handleClick={(value: string) => {setSelectedProject(data.find(item => item.value === value))}}
                            />
                        </div>
                    </div>
                )}
                selectedItem={selectedProject}
                onSearch={(searchText: string) => {setFilteredData(data.filter(item => toLower(item.label).startsWith(toLower(searchText))))}}
            />
        </div>
    )
}

export default Project;