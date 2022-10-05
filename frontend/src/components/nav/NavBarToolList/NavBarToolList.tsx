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
        <div className='d-inline-flex py-2'>
            {
                props.items.map((item, index) => (
                    <NavBarTool 
                        key={uniqueId()}
                        item={item}
                    />
                ))
            }
        </div>
        
    )

}

export default NavBarToolList;