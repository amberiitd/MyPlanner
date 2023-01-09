import { FC, useState, useRef, useEffect, useCallback } from "react";
import ButtonCircle from "../../../../../components/ButtonCircle/ButtonCircle";
import { SelectCategory } from "../../../../../components/input/Select/Select";
import SelectCard from "../../../../../components/input/SelectCard/SelectCard";

interface DropdownButtonMultiSelectProps{
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

const DropdownButtonMultiSelect: FC<DropdownButtonMultiSelectProps> = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const selectFormRef = useRef<HTMLDivElement>(null);
    const dropDownRef = useRef<HTMLDivElement>(null);

    const handleSelection = useCallback((item: any) => {
        let newSelection;
        if (item === 'cancel-all'){
            newSelection = [];
        }
        else {
            const index = (props.selectedItems || []).findIndex(selection => selection.value === item.value);
            if (index >=0){
                (props.selectedItems || []).splice(index, 1);
                newSelection = (props.selectedItems || []);
            }
            else{
                (props.selectedItems || []).push(item);
                newSelection = (props.selectedItems || []);
            }
        }
        
        props.onSelectionChange([...newSelection]);
    }, [props.selectedItems])
    
    useEffect(()=>{
        const handleCLick = (event: any)=>{
            if (!!props.disabled){
                return;
            }
            if(selectFormRef.current && selectFormRef.current.contains(event.target)){
                setDropdown(!dropdown);
            }
            else if(dropDownRef.current && dropDownRef.current.contains(event.target)){
                
            }
            else{
                setDropdown(false);
            } 
        }
        document.addEventListener('click', handleCLick, true);
        return () => {document.removeEventListener('click', handleCLick, true)};
    }, []);


    return (
        <div className=''>
            <div className='dropdown'>
                <div ref={selectFormRef}> 
                    <ButtonCircle
                        label={`+${props.data[0].items.length}`}
                        showLabel={true}
                        onClick={()=>{}}
                        extraClasses={`${dropdown? 'bg-thm-2': 'bg-light border text-muted'}`}
                    />
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
                                    selectedItems={(props.selectedItems || [])}
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

export default DropdownButtonMultiSelect;