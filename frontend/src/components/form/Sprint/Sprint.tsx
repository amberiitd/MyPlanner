import { FC, useState } from 'react'
import Select from '../../input/Select/Select';
import './Sprint.css'

interface SprintProps{

}

const Sprint: FC<SprintProps> = (props) => {

    const data= [
        {
            label: '',
            items: [
                {
                    label: 'Project2 Sprint 1',
                    value: 'value1',
                }
            ]
        }
    ];
    const [selectedIssue, setSelectedIssue] = useState<any>();
    const [filteredData, setFilteredData] = useState<any>(data);
    
    return (
        <div>
            <Select 
                label='Sprint'
                data={filteredData}
                selectedItem={selectedIssue}
                onSelectionChange={()=>{}}
            />
        </div>
    )
}

export default Sprint;