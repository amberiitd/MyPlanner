import { ConsoleLogger } from '@aws-amplify/core';
import { createContext, FC, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import './NavBarLink.css'

interface NavBarLinkProps{
    label: string;
    isActive: boolean;
    dropdownElement: JSX.Element | undefined;
}

export const NavDropDownContext = createContext<{
    dropdown: boolean;
    setDropdown: (val: boolean) => void; 
}>({
    dropdown: false,
    setDropdown: (val: boolean) => {}
});

const NavBarLink: FC<NavBarLinkProps> = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const handleClick = (e: any)=>{
            if (containerRef.current && containerRef.current.contains(e.target)){

            }
            else{
                setDropdown(false);
            }
        };

        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [containerRef])

    return (
        <NavDropDownContext.Provider value={{dropdown, setDropdown}}>
            <div
                ref={containerRef}
                className={`dropdown h-100 ms-2 ${props.isActive? 'border-bottom-themed': ''}`}
            >
                <div className='d-flex align-items-center h-100'>
                    <div 
                        className='navlinkbtn d-inline-flex p-1 px-2 rounded-1' id={`nav-link-${props.label}`}
                        onClick={()=> {
                            setDropdown(true)
                        }}
                    >
                        <div className='text-nowrap'>{props.label}</div>
                        <div className='ms-auto'>
                            <i className="bi bi-chevron-down ms-1 mt-1 icon-font" style={{fontSize: "70%"}}></i>
                        </div>
                    </div>
                </div>
                

                <div
                    className={`dropdown-menu nav-dropdown shadow-sm ${dropdown? 'show': ''}`}
                    onClick={(e)=>{e.stopPropagation()}}
                >
                   {props.dropdownElement}
                </div>
            </div>
        </NavDropDownContext.Provider>
    )
}

export default NavBarLink;