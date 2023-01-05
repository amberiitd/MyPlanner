import { FC, useEffect, useMemo, useState } from "react";
import { useApiSearch } from "../../hooks/useApiSearch";
import { User } from "../../model/types";
import { searchUser } from "../../services/api";
import SearchSelect from "../input/SearchSelect/SearchSelect";
import { LinkItem } from "../LinkCard/LinkCard";

interface PeopleSearchSelectProps{
    onSelectionChange: (people: User[]) => void; 
}

const PeopleSearchSelect: FC<PeopleSearchSelectProps> = (props) => {
    const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
    const searchQuery = useApiSearch(searchUser);
    const [lastOption, setLastOption] = useState<LinkItem | undefined>();
    const searchResult: LinkItem[] = useMemo(()=> {
        const peopleList =  searchQuery.data.map(p => ({
            label: p.fullName,
            value: p.email
        }))
        if (lastOption) return [...peopleList, lastOption];
        return peopleList;
    } , [searchQuery.data])

    const handleSearch = (e: any) => {
        const text: string = e.target.value;
        searchQuery.trigger(text);
        const emailParts = text.split('@');
        const searchEmail = emailParts.length > 1 ? text: `${text}@gmail.com`;
        setLastOption({
            label: searchEmail,
            value: searchEmail,
            caption: 'Select to invite'
        })
    }

    const handleUnselect = (event: any) => {
        if (event.type === 'cancel-all'){
            setSelectedPeople([]);
        }else if (event.type === 'cancel'){
            setSelectedPeople(selectedPeople.filter(p => p.email !== event.value));
        }
    }

    useEffect(() => {
        props.onSelectionChange(selectedPeople);
    }, [selectedPeople])

    return (
        <div>
            <SearchSelect 
                onSelection={(item) => setSelectedPeople([...selectedPeople, searchQuery.data.find(p => p.email === item.value)||{ email: item.value }])} 
                selectedItems={selectedPeople.map(p => ({label: p.fullName, value: p.email}))}
                data={[{
                    label: 'People',
                    items: searchResult
                }]} 
                label={"Select"}
                hideLabel={true}
                onSearch={handleSearch}
                onRemoveSelection={handleUnselect}
            />
        </div>
    )
}

export default PeopleSearchSelect;

