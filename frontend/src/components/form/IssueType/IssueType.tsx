import { label } from 'aws-amplify';
import { FC, useState } from 'react';
import { issueTypes } from '../../../pages/Projects/ProjectBoard/Backlog/IssueCreator/IssueTypeSelector/issueTypes';
import Select from '../../input/Select/Select';
import './IssueType.css';

interface IssueTypeProps{
    onChange: (type: string) => void;
}

const IssueType: FC<IssueTypeProps> = (props) => {
    const [filteredData, setFilteredData] = useState<any>(issueTypes);
    
    return (
        <div>
            <Select 
                label='Issue Type'
                isRequired={true}
                data={[{
                    label: 'Issue Types',
                    items:  filteredData
                }]}
                onSelectionChange={(item)=> {props.onChange(item.value)}}
            />
        </div>
    )
}

export default IssueType;