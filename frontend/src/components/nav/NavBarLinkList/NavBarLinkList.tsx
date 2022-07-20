import { FC, useEffect, useState } from 'react';
import NavBarLink from '../NavBarLink/NavBarLink';
import './NavBarLinkList.css';

interface NavBarLinkItem{
    id: string | number;
    label: string;
}
interface NavBarLinkListProps{
    items: NavBarLinkItem[];
    selectedItem: NavBarLinkItem;
}
const NavBarLinkList: FC<NavBarLinkListProps> = (props) => {
    const [selectedLink, setSelectedLink] = useState(props.selectedItem);
    const [cuttOff, setCuttOff] = useState(0);
    const resize = () => {
        const MAX_ALLOWED_WIDTH = 1000;
        const AVG_LINK_WIDTH = 80;
        if (window.innerWidth > MAX_ALLOWED_WIDTH){
            setCuttOff(0);
            return;
        }
        const newCutOff = Math.ceil((MAX_ALLOWED_WIDTH - window.innerWidth)/AVG_LINK_WIDTH);
        if (newCutOff !== cuttOff){
            setCuttOff(newCutOff);
        }
    };
    useEffect(()=>{
        resize();
        window.addEventListener('resize', resize)
    }, [])
    return (
        <div className='d-inline-flex border h-100'>
            { 
                props.items.slice(0, props.items.length - cuttOff).map( (item, index) => (
                    <NavBarLink key={`navlink-${index}`} 
                        label={item.label}
                        isActive={item.id === selectedLink.id}
                    />
                ))
            }
            <div hidden={cuttOff === 0}>
                <NavBarLink
                    label={`More`}
                    isActive={false}
                />
            </div>
            <div className='d-inline-flex'>
                <button className="btn btn-primary mx-4 my-2 d-none d-lg-block">Create</button>
                <button className="btn btn-primary mx-4 my-2 d-block d-lg-none">
                    <i className='bi bi-plus-lg'></i>
                </button>

            </div>
        </div>
    )
}

export default NavBarLinkList;