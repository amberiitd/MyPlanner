import { FC, useState } from 'react'
import Select from '../../input/Select/Select';
import './Assignee.css'

interface AssigneeProps{

}

const Assignee: FC<AssigneeProps> = (props) => {

    const data= [
        {
            label: 'Assignee',
            items: [
                {
                    label: 'Automatic',
                    value: 'value1',
                },
                {
                    label: 'Unassigned',
                    value: 'value2',
                }
            ]
        }
    ];
    const [selectedIssue, setSelectedIssue] = useState<any>();
    const [filteredData, setFilteredData] = useState<any>(data);
    
    return (
        <div>
            <Select 
                label='Assignee'
                data={filteredData}
                selectedItem={selectedIssue}
                onSelectionChange={()=> {}}
            />
        </div>
    )
}

export default Assignee;