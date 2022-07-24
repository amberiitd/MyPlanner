import { FC, useEffect, useRef, useState } from 'react';
import LinkCard from '../../LinkCard/LinkCard';
import './Select.css';

interface SelectProps{
    label: string;
    caption?: string;
    isRequired?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    data: any[];
    defaultSelectedValue?: string;
    handleSelect: (event: any) => void;
}

const Select: FC<SelectProps> = (props) => {
    const [isActive, setActive] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedOption, setSelectedOption] = useState(props.defaultSelectedValue);
    const [filteredOptions, setFilteredOptions] = useState(props.data);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectFormRef = useRef<HTMLDivElement>(null);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const id = (Math.random() + 1).toString(36).substring(7);

    const handleSelectEvent = (value: string) => {
        setSelectedOption(value);
        setDropdown(false);
        setSearchText('');
        handleSearch('');
        props.handleSelect(value);
    };

    const handleSearch = (prefix: string) => {
        setSearchText(prefix);
        if (prefix.trim().length === 0){
            setFilteredOptions(props.data);
        }else{
            setFilteredOptions(props.data.filter(item => item.label.toLowerCase().startsWith(prefix.toLocaleLowerCase())))
        } 
    }

    useEffect(()=>{
        const handleCLick = (event: any)=>{
            if (!!props.disabled){
                return;
            }
            if(selectFormRef.current && selectFormRef.current.contains(event.target)){
                inputRef.current?.focus();
                setActive(true);

                if(dropDownRef.current && !dropDownRef.current.contains(event.target)){
                    setDropdown(!dropdown)
                }
            }else{
                setActive(false);
                setDropdown(false);
            } 
        }
        document.addEventListener('click', handleCLick, true);
        return () => {document.removeEventListener('click', handleCLick, true)};
    }, []);

    return (
        <div >
            <div className='mb-1'>
                {props.label}
            </div>
            <div ref={selectFormRef} className='dropdown'>
                <div className={`d-flex flex-nowrap form-control border ${isActive? 'focus-outline': 'bg-light'} w-100`}> 
                    <input ref={inputRef} className={`${searchText.length ==0 ? 'input-cursor': 'w-100'} bg-transparent`} type="text" value={searchText} onChange={(e) => {handleSearch(e.target.value);}} hidden={!!props.disabled}/>

                    <div hidden={searchText.length > 0}>
                        {props.data.find(item => item.value === selectedOption)?.label}
                    </div>

                    <i className='bi bi-chevron-down ms-auto'></i>
                </div>

                <div ref={dropDownRef} className={`dropdown-menu w-100 ${dropdown? 'show': ''} shadow-sm`}>
                    <LinkCard 
                        label={props.label}
                        showLabel={false}
                        isLoading={false}
                        linkItems={filteredOptions}
                        handleClick={handleSelectEvent}
                    />
                </div>
            </div>
        </div>
    )
}

export default Select;