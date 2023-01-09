import { FC, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import Select from '../../input/Select/Select';
import './Assignee.css'

interface AssigneeProps{

}

const Assignee: FC<AssigneeProps> = (props) => {
    const people = useSelector((state: RootState) => state.users.values);

    const [selectedIssue, setSelectedIssue] = useState<any>();
    
    return (
        <div>
            <Select 
                label='Assignee'
                data={[
                    {
                        label: 'Assignee',
                        items: people.map(p => ({label: p.fullName, value: p.email}))
                    }
                ]}
                selectedItem={selectedIssue}
                onSelectionChange={()=> {}}
            />
        </div>
    )
}

export default Assignee;