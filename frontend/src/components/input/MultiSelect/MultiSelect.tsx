import { isEmpty, toLower } from 'lodash';
import { FC, useEffect, useRef, useState } from 'react';
import Button from '../../Button/Button';
import LinkCard from '../../LinkCard/LinkCard';
import { SelectCategory } from '../Select/Select';
import SelectCard from '../SelectCard/SelectCard';
import './MultiSelect.css';
import SelectBadge from './SelectBadge/SelectBadge';

interface MultiSelectProps{
    label: string;
    caption?: string;
    isRequired?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    selectedItems?: any[];
    hideToggleIcon?: boolean;
    hideLabel?: boolean;
    data: SelectCategory[];
    onSelectionChange: (event: any[]) => void;
}

const MultiSelect: FC<MultiSelectProps> = (props) => {
    const [isActive, setActive] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [selectedItems, setSelectedItems] = useState(props.selectedItems || []);
    const selectFormRef = useRef<HTMLDivElement>(null);
    const badgRef = useRef<HTMLDivElement>(null);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const cancelSeclectRef = useRef<HTMLDivElement>(null);

    const handleSelection = (item: any) => {
        let newSelection;
        if (item === 'cancel-all'){
            newSelection = [];
        }
        else {
            const index = selectedItems.findIndex(selection => selection.value === item.value);
            if (index >=0){
                selectedItems.splice(index, 1);
                newSelection = selectedItems;
            }
            else{
                selectedItems.push(item);
                newSelection = selectedItems;
            }
        }
        
        setSelectedItems([...newSelection]);
        props.onSelectionChange([...newSelection]);
    }

    const handleSelectBadgeCancel = (value: string) => {
        setSelectedItems(selectedItems.filter(item => item.value !== value));
    }
    
    useEffect(()=>{
        const handleCLick = (event: any)=>{
            if (!!props.disabled){
                return;
            }
            if(selectFormRef.current && selectFormRef.current.contains(event.target)){
                if(badgRef.current && badgRef.current.contains(event.target)){
                    setActive(true);
                }
                else if(cancelSeclectRef.current && cancelSeclectRef.current.contains(event.target)){

                }
                else{
                    setActive(true);
                    setDropdown(!dropdown);
                }
            }
            else if(dropDownRef.current && dropDownRef.current.contains(event.target)){
                
            }
            else{
                setActive(false);
                setDropdown(false);
            } 
        }
        document.addEventListener('click', handleCLick, true);
        return () => {document.removeEventListener('click', handleCLick, true)};
    }, [dropdown]);


    return (
        <div className='multiselect w-100'>
            <div className='mb-1' hidden={props.hideLabel}>
                {props.label}{props.isRequired? '*': ''}
            </div>
            <div className='dropdown'>
                <div ref={selectFormRef} className={`d-flex flex-nowrap form-control rounded-1 border ${isActive? 'focus-outline': 'bg-light'} w-100 cursor-pointer`}> 
                    {/* 
                    // NO SEARCH FEATURE HERE
                    <input ref={inputRef} 
                        className={`${searchText.length ==0 ? 'input-cursor': 'w-100'} bg-transparent`} 
                        type="text" 
                        value={searchText} 
                        onChange={(e) => {handleSearch(e.target.value); setSearchText(e.target.value)}} 
                        hidden={props.disabled || props.searchDisabled} 
                    />

                    <div hidden={searchText.length > 0}>
                    </div> */}
                    <div ref={badgRef} className='d-flex flex-wrap'>
                        {
                            selectedItems.map((item, index)=> (
                                <div className='me-1' key={`${props.label}-multiselect-selected-${index}`}>
                                    <SelectBadge 
                                        label={item.label}
                                        value={item.value}
                                        handleCancel={()=> {handleSelection(item)}}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <div className='ms-auto'></div>

                    <div ref={cancelSeclectRef} className='' hidden={selectedItems.length === 0}>
                        <Button 
                            label='Cancel'
                            hideLabel={true}
                            rightBsIcon='x-circle'
                            extraClasses='btn-as-inherit'
                            handleClick={()=> {handleSelection('cancel-all')}}
                        />
                    </div>
                    <div className='py-auto ms-1'>
                        <i className='bi bi-chevron-down ' hidden={!!props.hideToggleIcon} style={{fontSize: '70%'}}></i>
                    </div>
                </div>

                <div ref={dropDownRef} className={`dropdown-menu mt-1 w-100 ${dropdown? 'show': ''} shadow-sm`}>
                    <div>
                        {props.data.map((catg, index)=> (
                            <div key={`category-${index}`} className='mt-1'>
                                <SelectCard 
                                    label={catg.label}
                                    showLabel={!!catg.showLabel}
                                    isLoading={false}
                                    items={catg.items}
                                    extraClasses='quote'
                                    multiSelect={true}
                                    selectedItems={selectedItems}
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

export default MultiSelect;