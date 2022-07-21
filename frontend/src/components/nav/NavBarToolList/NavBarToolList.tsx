import { FC } from 'react';
import NavBarTool from '../NavBarTool/NavBarTool';
import './NavBarToolList.css';

export interface NavBarToolItem{
    label: string;
    bsIcon: string;
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
                        key={index}
                        label={item.label}
                        bsIcon={item.bsIcon}
                    />
                ))
            }
        </div>
        
    )

}

export default NavBarToolList;