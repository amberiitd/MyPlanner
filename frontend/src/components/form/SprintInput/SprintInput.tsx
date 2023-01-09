import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { refreshSprint } from '../../../app/slices/sprintSlice';
import { RootState } from '../../../app/store';
import { useQuery } from '../../../hooks/useQuery';
import { CrudPayload, Sprint } from '../../../model/types';
import { projectCommonCrud } from '../../../services/api';
import Select from '../../input/Select/Select';
import { LinkItem } from '../../LinkCard/LinkCard';
import './Sprint.css'

interface SprintInputProps{
    projectId?: string;
    onChange: (value: string) => void;
}

const SprintInput: FC<SprintInputProps> = (props) => {
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const [data, setData] = useState<Sprint[]>([]);
    useEffect(()=>{
        projectCommonQuery.trigger({
            action: 'RETRIEVE',
            data: {projectId: props.projectId,},
            itemType: 'sprint'
        } as CrudPayload)
        .then((res) => {
            setData(res as Sprint[]);
        })
    }, [props.projectId])
    const [selectedIssue, setSelectedIssue] = useState<any>();
    
    return (
        <div>
            <Select 
                label='Sprint'
                data={[{
                    label: 'Sprints',
                    items: data.map(s => ({
                        label: s.sprintName,
                        value: s.id
                    }))
                }]}
                selectedItem={selectedIssue}
                onSelectionChange={(item)=>{props.onChange(item.value)}}
            />
        </div>
    )
}

export default SprintInput;