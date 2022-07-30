import { FC, useEffect, useRef, useState } from 'react';
import './Select.css';

interface SelectProps{
    label: string;
    caption?: string;
    isRequired?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    dropdownElement: JSX.Element;
    selectedItem?: any;
    onSearch: (event: any) => void;
}

const Select: FC<SelectProps> = (props) => {
    const [isActive, setActive] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [searchText, setSearchText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const selectFormRef = useRef<HTMLDivElement>(null);
    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const handleCLick = (event: any)=>{
            if (!!props.disabled){
                return;
            }
            if(selectFormRef.current && selectFormRef.current.contains(event.target)){
                if(dropDownRef.current && dropDownRef.current.contains(event.target)){
                    setSearchText('');
                    inputRef.current?.blur();
                }else{
                    inputRef.current?.focus();
                    setActive(true);
                }
                setDropdown(!dropdown);
            }else{
                setActive(false);
                setDropdown(false);
                setSearchText('');
            } 
        }
        document.addEventListener('click', handleCLick, true);
        return () => {document.removeEventListener('click', handleCLick, true)};
    }, [dropdown]);

    return (
        <div >
            <div className='mb-1'>
                {props.label}{props.isRequired? '*': ''}
            </div>
            <div ref={selectFormRef} className='dropdown'>
                <div className={`d-flex flex-nowrap form-control border ${isActive? 'focus-outline': 'bg-light'} w-100`}> 
                    <input ref={inputRef} className={`${searchText.length ==0 ? 'input-cursor': 'w-100'} bg-transparent`} type="text" value={searchText} onChange={(e) => {props.onSearch(e.target.value); setSearchText(e.target.value)}} hidden={!!props.disabled}/>

                    <div hidden={searchText.length > 0}>
                        {props.selectedItem?.label}
                    </div>

                    <i className='bi bi-chevron-down ms-auto'></i>
                </div>

                <div ref={dropDownRef} className={`dropdown-menu mt-1 w-100 ${dropdown? 'show': ''} shadow-sm`}>
                    {props.dropdownElement}
                </div>
            </div>
        </div>
    )
}

export default Select;