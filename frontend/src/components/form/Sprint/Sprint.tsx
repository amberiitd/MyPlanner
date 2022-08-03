import { toLower } from 'lodash';
import { FC, useState } from 'react'
import Select from '../../input/Select/Select';
import LinkCard from '../../LinkCard/LinkCard';
import './Sprint.css'

interface SprintProps{

}

const Sprint: FC<SprintProps> = (props) => {

    const data= [
        {
            label: 'Project2 Sprint 1',
            value: 'value1',
        }
    ];
    const [selectedIssue, setSelectedIssue] = useState<any>();
    const [filteredData, setFilteredData] = useState<any>(data);
    
    return (
        <div>
            <Select 
                label='Sprint'
                dropdownElement={(
                    <div>
                        <LinkCard 
                            label='IssueType'
                            showLabel={false}
                            isLoading={false}
                            linkItems={filteredData}
                            extraClasses='quote'
                            handleClick={(value: string) => {setSelectedIssue(data.find(item => item.value === value))}}
                        />
                    </div>
                )}
                selectedItem={selectedIssue}
                onSearch={(searchText: string) => {setFilteredData(data.filter(item => toLower(item.label).startsWith(toLower(searchText))))}}
            />
        </div>
    )
}

export default Sprint;