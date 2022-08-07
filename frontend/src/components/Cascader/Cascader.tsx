import { FC, useEffect, useRef, useState } from 'react';
import CustomOption from '../CustomOption/CustomOption';
import './Cascader.css';

export interface CascaderNode{
    label: string;
    children?: CascaderNode[];
    dropdownElement: JSX.Element | undefined;
    handleSelect: (event: any) => void;
}

interface CascaderProps{
    id: string;
    nodeList: CascaderNode[];
    parentView?: boolean 
}

const Cascader: FC<CascaderProps> = (props) => {
    
    return (
        <div className='w-100 py-1 position-relative'>
            {
                props.nodeList.map((node, index) =>(
                    <DropdownTree key={`cascader-parent-${props.id}${index}`}
                        {...node}
                        index={index}
                    />
                ))
            }
        </div>
    )
}

const DropdownTree : FC<any> = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const submenu = ((props.children && props.children.length > 0) ||  !!props.dropdownElement);
    const toggleRef = useRef<HTMLDivElement>(null);
    const bodyRef= useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const handleClickOutside = (e: any)=> {
            if(bodyRef.current && bodyRef.current.contains(e.target)){
                return;
            }
            if (toggleRef.current && !toggleRef.current.contains(e.target)) {
                setDropdown(false);
            }else if(toggleRef.current && toggleRef.current.contains(e.target)){
                setDropdown(!dropdown);
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [dropdown])

    return (
        <div className='dropdown dropend' >
            <div className='' ref={toggleRef}>
                <CustomOption  
                    label={props.label}
                    value={props.label.trim()}
                    rightBsIcon={`${submenu ? 'chevron-right': ''}`}
                />
            </div>
            {
                submenu? (
                    <div className={`dropdown-menu ${dropdown ? 'show': ''} position-absolute start-100 top-0`} ref={bodyRef}>
                        {(props.children && props.children.length > 0)? (
                        <Cascader 
                            id={`${props.id}${props.index}`}
                            nodeList={props.children}
                            parentView={dropdown}
                        />): ''}
                        {props.dropdownElement}
                    </div>
                ): ''
            }
        </div>
)
}

export default Cascader;