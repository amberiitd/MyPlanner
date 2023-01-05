import { isEmpty, toLower } from 'lodash';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../Button/Button';
import LinkCard from '../../LinkCard/LinkCard';
import SelectBadge from '../MultiSelect/SelectBadge/SelectBadge';
import { SelectCategory } from '../Select/Select';
import './SearchSelect.css';

interface SearchSelectProps{
    selectedItems?: any[]
    focus?: boolean;
    onSelection: (item: any) => void;
    data: SelectCategory[];
    disabled?: boolean;
    label: string;
    hideLabel?: boolean;
    isRequired?: boolean;
    extraClasses?: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveSelection: (event: {type: string; value: string;}) => void;
}

const SearchSelect: FC<SearchSelectProps> = (props) => {
    const [isActive, setActive] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [searchText, setSearchText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const selectFormRef = useRef<HTMLDivElement>(null);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const badgRef = useRef<HTMLDivElement>(null);
    const cancelSeclectRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if((inputRef.current && props.selectedItems)){
            setTimeout(()=>{
                setActive(true);
                inputRef.current?.focus();
            }, 100)
        }
    }, [props.selectedItems])

    const handleSelection = (item: any) => {
        props.onSelection(item);

        // due deligence
        setSearchText('');
        setDropdown(false);
        // inputRef.current?.blur();
    }
    
    // const handleCLick = useCallback((event: any)=>{
    //     if (!!props.disabled){
    //         return;
    //     }
    //     if(selectFormRef.current && selectFormRef.current.contains(event.target)){
    //         if(badgRef.current && badgRef.current.contains(event.target)){
    //             setActive(true);
    //         }
    //         else if(cancelSeclectRef.current && cancelSeclectRef.current.contains(event.target)){

    //         }
    //         else{
    //             inputRef.current?.focus();
    //             setActive(true);
    //         }
    //     }
    //     else if(dropDownRef.current && dropDownRef.current.contains(event.target)){
            
    //     }else{
    //         setActive(false);
    //     } 
    // }, [dropDownRef]);

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
                    inputRef.current?.focus();
                    setActive(true);
                }
            }
            else if(dropDownRef.current && dropDownRef.current.contains(event.target)){
                console.log('ckicked drop')
            }else{
                setActive(false);
                setDropdown(false);
                inputRef.current?.blur();
            } 
        };
        document.addEventListener('click', handleCLick, true);
        return () => {document.removeEventListener('click', handleCLick, true)};
    }, []);

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
                    <div ref={badgRef} className='d-flex flex-wrap'>
                        {
                            (props.selectedItems || []).map((item, index)=> (
                                <div className='me-1' key={`${props.label}-multiselect-selected-${index}`}>
                                    <SelectBadge 
                                        label={item.label}
                                        value={item.value}
                                        handleCancel={()=> {props.onRemoveSelection({type: 'cancel', value: item.value})}}
                                    />
                                </div>
                            ))
                        }
                        <input ref={inputRef} 
                            className={`w-100 bg-transparent`} type="text" 
                            value={searchText} 
                            onChange={(e) => {
                                setSearchText(e.target.value); 
                                props.onSearch(e);
                                if (e.target.value.length > 0){
                                    setDropdown(true);
                                }else{
                                    setDropdown(false);
                                }
                            }}
                            hidden={!!props.disabled}
                            placeholder={'Enter email...'}
                        />
                    </div>
                    <div className='d-flex ms-auto'>
                        {
                            !isEmpty(props.selectedItems) &&
                            <div ref={cancelSeclectRef} className='d-flex align-items-center'>
                                <Button 
                                    label='Cancel'
                                    hideLabel={true}
                                    rightBsIcon='x-circle'
                                    extraClasses='btn-as-inherit'
                                    handleClick={()=> {props.onRemoveSelection({type:'cancel-all', value: ''})}}
                                />
                            </div>
                        }
                        <div className='d-flex align-items-center mx-1'>
                            <i className='bi bi-search'></i>
                        </div>
                    </div>
                </div>

                <div className={`dropdown-menu mt-1 w-100 ${dropdown? 'show': ''} shadow-sm`}>
                    <div ref={dropDownRef} className='py-3'>
                        {props.data.map((catg, index)=> (
                            <div key={`category-${index}`} className='mt-1'>
                                <LinkCard 
                                    label={catg.label}
                                    showLabel={!!catg.showLabel}
                                    isLoading={false}
                                    linkItems={catg.items}
                                    selectedLinks={props.selectedItems || []}
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

export default SearchSelect;