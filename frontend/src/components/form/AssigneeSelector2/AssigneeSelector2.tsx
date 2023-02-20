import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateIssue } from '../../../app/slices/issueSlice';
import { refreshUser } from '../../../app/slices/userSlice';
import { RootState } from '../../../app/store';
import { useApiSearch } from '../../../hooks/useApiSearch';
import { useQuery } from '../../../hooks/useQuery';
import { CrudPayload, User } from '../../../model/types';
import PeopleInput from '../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/AssigneeSelector/PeopleInput';
import PeopleOption from '../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/AssigneeSelector/PeopleOption/PeopleOption';
import { ProjectBoardContext } from '../../../pages/Projects/ProjectBoard/ProjectBoard';
import { fetchProjectPeople, projectCommonCrud } from '../../../services/api';
import ButtonCircle from '../../ButtonCircle/ButtonCircle';
import LinkCard from '../../LinkCard/LinkCard';


interface AssigneeSelectorProps{
    projectId?: string;
    onSelectionChange: (value: string)=>void;
}

const AssigneeSelector: FC<AssigneeSelectorProps> = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const compRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const users = useSelector((state: RootState) => state.users.values);
    const userQuery = useQuery((payload: any) => fetchProjectPeople(payload));
    const dispatch = useDispatch();
    const people = useMemo(() => [{
        fullName: 'Unassigned',
        email: 'unassigned'
    } as User, ...users], [users])
    const searchQuery = useApiSearch(useCallback(async (search, c) => {
        if (!search){
            return people;
        }
        return people.filter(p => p.email.toLowerCase().startsWith(search) || p.fullName?.toLowerCase().startsWith(search));
    }, [people]), undefined, true);
    const [selectedAssignee, setSelectedAssignee] = useState<User | undefined>(people[0]) ;
    const [searchText, setSearchText] = useState('');
    useEffect(()=> {
        const handleWindowClick = (e: any) => {
            if(compRef && compRef.current && compRef.current.contains(e.target)){
                if(inputRef && inputRef.current && inputRef.current.contains(e.target)){
                    setDropdown(true);
                }
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

    useEffect(()=>{
        props.onSelectionChange(selectedAssignee?.email || '');
    }, [selectedAssignee])
    // useEffect(()=>{
    //     setTimeout(()=>{
    //         searchQuery.trigger('')
    //     }, 1000)
        
    // }, [people])

    return (
        <div ref={compRef} className='dropdown px-1'>
            <div ref={inputRef} className=''>
                <PeopleInput 
                    label='Search'
                    hideLabel={true}
                    focus={dropdown}
                    loading={false}
                    value={searchText || ''}
                    selectedPeople={selectedAssignee}
                    handleChange={(value)=>{setSearchText(value); searchQuery.trigger(value.toLowerCase())}} 
                />
            </div>
            <div className={`dropdown-menu w-100 shadow-sm ${dropdown? 'show': ''}`} style={{right: 0, top: '3em'}}>
                <LinkCard 
                    label={''} 
                    showLabel={false} 
                    isLoading={false} 
                    extraClasses='quote'
                    linkItems={[
                        ...searchQuery.data.map(p => ({label: p.fullName, value: p.email}))
                    ]} 
                    optionType={PeopleOption}
                    handleClick={(item)=>{
                        setSelectedAssignee(people.find(p => p.email === item.value));
                        setDropdown(false);
                    }}                    
                />
            </div>
        </div>
    )
}
export default AssigneeSelector;