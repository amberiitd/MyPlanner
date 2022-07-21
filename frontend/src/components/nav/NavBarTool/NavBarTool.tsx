import { FC } from 'react';
import './NavBarTool.css';

interface NavBarToolProps{
    label: string;
    bsIcon: string;
}
const NavBarTool: FC<NavBarToolProps> = (props) => {

    return (
        <div className='dropdown mx-2'>
            <div className='tool-icon rounded-circle hover-focus border'>
                <i className={`bi bi-${props.bsIcon}`}></i>
            </div>
        </div>
    )
}

export default NavBarTool;