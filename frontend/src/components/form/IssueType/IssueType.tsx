import { FC, useState } from 'react';
import Select from '../../input/Select/Select';
import './IssueType.css';

interface IssueTypeProps{

}

const IssueType: FC<IssueTypeProps> = () => {
    const data= [
        {
            label: '',
            items: [
                {
                    label: 'Epic',
                    value: 'value1',
                },
                {
                    label: 'Bug',
                    value: 'value2',
                },
                {
                    label: 'Story',
                    value: 'value3',
                },
            ]
        }
    ];
    const [selectedIssue, setSelectedIssue] = useState<any>();
    const [filteredData, setFilteredData] = useState<any>(data);
    
    return (
        <div>
            <Select 
                label='Issue Type'
                isRequired={true}
                selectedItem={selectedIssue}
                data={filteredData}
                onSelectionChange={()=> {}}
            />
        </div>
    )
}

export default IssueType;