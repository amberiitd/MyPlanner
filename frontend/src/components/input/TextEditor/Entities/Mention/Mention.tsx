import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import PeopleOption from '../../../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/AssigneeSelector/PeopleOption/PeopleOption';
import LinkCard from '../../../../LinkCard/LinkCard';
import './Mention.css';

interface MentionProps{
    onSelect: (entity: any) => void;
    searchText: string;
}

const Mention: FC<MentionProps> = (props) => {
    const users = useSelector((state: RootState) => state.users.values);

    return (
        <div className='rounded bg-white shadow-sm border' style={{opacity: 1, borderColor: 'whitesmoke', minWidth: '20em'}}>
            <LinkCard 
                label={'People'} 
                showLabel={false} 
                isLoading={false} 
                extraClasses='quote'
                linkItems={users.filter(u => u.email.toLowerCase().startsWith(props.searchText.toLowerCase()) || u.fullName.toLowerCase().startsWith(props.searchText.toLowerCase())).map(p => ({label: p.fullName, value: p.email}))} 
                optionType={PeopleOption}
                handleClick={(item)=>{
                    props.onSelect({
                        type: 'MENTION',
                        mutability: 'IMMUTABLE',
                        data: {
                            label: '@'+ item.label,
                            id: item.value
                        }
                    })
                }}                    
            />
        </div>
    )
}

export default Mention;