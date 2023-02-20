import { uniqueId } from 'lodash';
import { FC } from 'react';
import NavBarTool from '../NavBarTool/NavBarTool';
import './NavBarToolList.css';

export interface NavBarToolItem{
    label: string;
    bsIcon: string;
    isDropdown?: boolean; 
    dropdownElement?: JSX.Element;
}

interface NavBarToolListProps{
    items: NavBarToolItem[];
}
const NavBarToolList: FC<NavBarToolListProps> = (props) => {

    return (
        <div className='h-100 d-inline-flex align-items-center'>
            {
                props.items.map((item, index) => (
                    <div key={`navbar-tool-item-${index}`} className='mx-1'>
                        <NavBarTool 
                            item={item}
                        />
                    </div>
                    
                ))
            }
        </div>
        
    )

}

export default NavBarToolList;