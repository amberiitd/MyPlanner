import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateIssue } from '../../../../../../app/slices/issueSlice';
import { RootState } from '../../../../../../app/store';
import Button from '../../../../../../components/Button/Button';
import ButtonCircle from '../../../../../../components/ButtonCircle/ButtonCircle';
import LinkCard from '../../../../../../components/LinkCard/LinkCard';
import { useApiSearch } from '../../../../../../hooks/useApiSearch';
import { useQuery } from '../../../../../../hooks/useQuery';
import { CrudPayload } from '../../../../../../model/types';
import { projectCommonCrud } from '../../../../../../services/api';
import { ProjectBoardContext } from '../../../ProjectBoard';
import './AssigneeSelector.css';
import PeopleInput from './PeopleInput';
import PeopleOption from './PeopleOption/PeopleOption';

interface AssigneeSelectorProps{
    assignee: string;
    issueId: string;
}

const AssigneeSelector: FC<AssigneeSelectorProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const [dropdown, setDropdown] = useState(false);
    const compRef = useRef<HTMLDivElement>(null);
    const people = useSelector((state: RootState) => state.users);
    const projectCommonQuery = useQuery((payload: CrudPayload)=> projectCommonCrud(payload));
    const searchQuery = useApiSearch(async (search, c) => {
        if (!search){
            return people.values;
        }
        return people.values.filter(p => p.email.toLowerCase().startsWith(search) || p.fullName?.toLowerCase().startsWith(search));
    }, undefined, true);
    const selectedAssignee = useMemo(()=> people.values.find(p => p.email === props.assignee), [props.assignee]);
    const [searchText, setSearchText] = useState(selectedAssignee?.fullName);
    const dispatch = useDispatch();

    useEffect(()=> {
        const handleWindowClick = (e: any) => {
            if(compRef && compRef.current && compRef.current.contains(e.target)){

            }
            else{
                setDropdown(false);
            }
        };

        document.addEventListener('click', handleWindowClick, true);

        return () => {
            document.removeEventListener('click', handleWindowClick, true);
        }
    }, [])
    return (
        <div ref={compRef} className='dropdown'>
            <div className='mx-1'>
                <ButtonCircle
                    label={selectedAssignee?.fullName.split(' ').map(p => p[0]).join('') || 'P'}
                    showLabel={!!selectedAssignee}
                    bsIcon={'person-fill'}
                    size='sm'
                    extraClasses='p-1 rounded-circle btn-as-thm'
                    onClick={()=>{setDropdown(!dropdown)}}
                />
            </div>
            <div className={`dropdown-menu shadow-sm ${dropdown? 'show': ''}`} style={{right: 0, top: '2em'}}>
                <div className='px-1' style={{width: '17em'}}>
                    <PeopleInput 
                        label='Search'
                        hideLabel={true}
                        focus={dropdown}
                        loading={searchQuery.loading || projectCommonQuery.loading}
                        value={searchText || ''}
                        selectedPeople={selectedAssignee}
                        handleChange={(value)=>{setSearchText(value); searchQuery.trigger(value.toLowerCase())}} 
                    />
                </div>
                <LinkCard 
                    label={''} 
                    showLabel={false} 
                    isLoading={false} 
                    extraClasses='quote'
                    linkItems={[ 
                        {
                            label: 'Unassigned',
                            value: 'unassigned'
                        },
                        ...searchQuery.data.map(p => ({label: p.fullName, value: p.email}))
                    ]} 
                    optionType={PeopleOption}
                    handleClick={(item)=>{
                        projectCommonQuery.trigger({
                            action: 'UPDATE',
                            data: {projectId: openProject?.id, id: props.issueId, assignee: item.value},
                            itemType: 'issue'
                        } as CrudPayload)
                        .then(()=>{
                            dispatch(updateIssue({id: props.issueId, data: {assignee: item.value}})); 
                        })
                    }}                    
                />
            </div>
        </div>
    )
}
export default AssigneeSelector;