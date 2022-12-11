import { isEmpty, toLower } from 'lodash';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import LinkCard from '../../LinkCard/LinkCard';
import './Select.css';

export interface SelectCategory{
    label: string;
    items: any[];
    showLabel?: boolean;
}
interface SelectProps{
    label: string;
    hideLabel?: boolean;
    caption?: string;
    isRequired?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    selectedItem?: any;
    hideToggleIcon?: boolean;
    extraClasses?: string;
    data: SelectCategory[];
    focus?: boolean;
    onSelectionChange: (event: any) => void;
}

const Select: FC<SelectProps> = (props) => {
    const [isActive, setActive] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItem, setSelectedItem] = useState(props.selectedItem);
    const [filteredData, setFilteredData] = useState<SelectCategory[]>(props.data || []);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectFormRef = useRef<HTMLDivElement>(null);
    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(inputRef.current && props.focus){
            inputRef.current?.focus();
            setActive(true);
            setDropdown(!dropdown);
        }
    }, [])

    const handleSelection = (item: any) => {
        for (let i = 0; i< props.data.length; i++){
            const option = props.data[i].items.find(datum => datum.value === item.value);
            if (!isEmpty(option)){
                setSelectedItem(option);
                props.onSelectionChange(option);

                // due deligence
                setDropdown(!dropdown);
                setSearchText('');
                setFilteredData(props.data);
                inputRef.current?.blur();

                return;
            }
        }
    }

    const handleSearch = (searchText: string) => {
        setFilteredData((props.data || []).map((catg) => (
            {
                ...catg,
                items: catg.items.filter(item => toLower(item.label).startsWith(toLower(searchText)))
            }
        )));
    }
    
    const handleCLick = useCallback((event: any)=>{
        if (!!props.disabled){
            return;
        }
        if(selectFormRef.current && selectFormRef.current.contains(event.target)){
            if(!(dropDownRef.current && dropDownRef.current.contains(event.target))){
                inputRef.current?.focus();
                setActive(true);
                setDropdown(!dropdown);
            }
        }else{
            setActive(false);
            setDropdown(false);
            setSearchText('');
            setFilteredData(props.data);
        } 
    }, [dropdown]);
    useEffect(()=>{
        
        document.addEventListener('click', handleCLick, true);
        return () => {document.removeEventListener('click', handleCLick, true)};
    }, []);

    useEffect(()=>{
        
        setSelectedItem(props.selectedItem);
    }, [props]);

    return (
        <div className='px-1'>
            {
                !props.hideLabel &&
                <div className='mb-1'>
                    {props.label}<span className='text-thm ms-1' style={{fontSize: 'small'}}>{props.isRequired? '*': ''}</span>
                </div>
            }
            <div ref={selectFormRef} className='dropdown'>
                <div className={`d-flex flex-nowrap form-control-custom rounded-1 ${props.extraClasses?? 'border bg-as-light'} ${isActive? 'focus-outline': ''} w-100 cursor-pointer`}> 
                    <input ref={inputRef} 
                        className={`${searchText.length ==0 ? 'input-cursor': 'w-100'} bg-transparent`} type="text" 
                        value={searchText} 
                        onChange={(e) => {handleSearch(e.target.value); setSearchText(e.target.value)}} 
                        hidden={!!props.disabled}
                        // onFocus={()=>{
                        //     setActive(true);
                        //     setDropdown(!dropdown);
                        // }}
                        // onBlur={()=>{
                        //     // setActive(false);
                        //     // setDropdown(false);
                        //     // setSearchText('');
                        //     // setFilteredData(props.data);
                        // }}
                    />

                    <div hidden={searchText.length > 0}>
                        {selectedItem?.label}
                    </div>

                    <div className='py-auto ms-auto'>
                        <i className='bi bi-chevron-down ' hidden={!!props.hideToggleIcon} style={{fontSize: '70%'}}></i>
                    </div>
                </div>

                <div ref={dropDownRef} className={`dropdown-menu mt-1 w-100 ${dropdown? 'show': ''} shadow-sm`}>
                    <div>
                        {filteredData.map((catg, index)=> (
                            <div key={`category-${index}`} className='mt-1'>
                                <LinkCard 
                                    label={catg.label}
                                    showLabel={!!catg.showLabel}
                                    isLoading={false}
                                    linkItems={catg.items}
                                    selectedLinks={selectedItem?[selectedItem]: []}
                                    extraClasses='quote'
                                    handleClick={handleSelection}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Select;