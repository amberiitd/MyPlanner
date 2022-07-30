import { toLower } from 'lodash';
import { FC, useState } from 'react';
import Select from '../../input/Select/Select';
import LinkCard from '../../LinkCard/LinkCard';
import './IssueType.css';

interface IssueTypeProps{

}

const IssueType: FC<IssueTypeProps> = () => {
    const data= [
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
    ];
    const [selectedIssue, setSelectedIssue] = useState<any>();
    const [filteredData, setFilteredData] = useState<any>(data);
    
    return (
        <div>
            <Select 
                label='Issue Type'
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
                isRequired={true}
                selectedItem={selectedIssue}
                onSearch={(searchText: string) => {setFilteredData(data.filter(item => toLower(item.label).startsWith(toLower(searchText))))}}
            />
        </div>
    )
}

export default IssueType;