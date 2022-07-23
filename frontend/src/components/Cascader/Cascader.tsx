import { FC, useEffect, useRef, useState } from 'react';
import CustomLink from '../CustomLink/CustomLink';
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
                    <Dropdown key={`cascader-parent-${props.id}${index}`}
                        {...node}
                        index={index}
                    />
                ))
            }
        </div>
    )
}

const Dropdown : FC<any> = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const submenu = ((props.children && props.children.length > 0) ||  !!props.dropdownElement);
    const ref = useRef<HTMLHeadingElement>(null);
    useEffect(()=>{
        const handleClickOutside = (e: any)=> {
            if (ref.current && !ref.current.contains(e.target)) {
                setDropdown(false);
            }else if(ref.current && ref.current.contains(e.target)){
                setDropdown(!dropdown);
            }
        };
            document.addEventListener('click', handleClickOutside, true);
            return () => {
            document.removeEventListener('click', handleClickOutside, true);
            };
    }, [setDropdown])

    return (
        <div className='dropdown dropend' >
            <div className='' ref={ref}>
                <CustomLink  
                    label={props.label}
                    rightBsIcon={`${submenu ? 'chevron-right': ''}`}
                    handleClick={props.handleSelect}
                />
            </div>
            {
                submenu? (
                    <div className={`dropdown-menu ${dropdown ? 'show': ''} position-absolute start-100 top-0`}>
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