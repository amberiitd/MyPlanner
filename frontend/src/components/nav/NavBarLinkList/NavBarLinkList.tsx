import { FC, useEffect, useState } from 'react';
import Cascader from '../../Cascader/Cascader';
import NavBarLink from '../NavBarLink/NavBarLink';
import './NavBarLinkList.css';

interface NavBarLinkItem{
    id: string | number;
    label: string;
    dropdownElement: JSX.Element;
}
interface NavBarLinkListProps{
    items: NavBarLinkItem[];
    selectedItem: NavBarLinkItem;
}
const NavBarLinkList: FC<NavBarLinkListProps> = (props) => {
    const [selectedLink, setSelectedLink] = useState(props.selectedItem);
    const [cuttOff, setCuttOff] = useState(0);
    const [moreLinks, setMoreLinks] = useState([]);
    const resize = () => {
        const MAX_ALLOWED_WIDTH = 1200;
        const AVG_LINK_WIDTH = 80;
        if (window.innerWidth > MAX_ALLOWED_WIDTH){
            setCuttOff(0);
            return;
        }
        const newCutOff = Math.ceil((MAX_ALLOWED_WIDTH - window.innerWidth)/AVG_LINK_WIDTH);
        if (newCutOff !== cuttOff){
            setCuttOff(Math.min(newCutOff, props.items.length));
        }
    };
    useEffect(()=>{
        resize();
        window.addEventListener('resize', resize)
    }, [])
    return (
        <div className='d-inline-flex h-100 pt-1'>
            { 
                props.items.slice(0, props.items.length - cuttOff).map( (item, index) => (
                    <NavBarLink key={`navlink-${index}`} 
                        label={item.label}
                        isActive={item.id === selectedLink.id}
                        dropdownElement={item.dropdownElement}
                    />
                ))
            }
            <div hidden={cuttOff === 0}>
                <NavBarLink
                    label={`More`}
                    isActive={false}
                    dropdownElement={
                        <Cascader 
                            id="0"
                            nodeList={props.items.slice(props.items.length - cuttOff, props.items.length).map(item => ({
                                label: item.label,
                                dropdownElement: item.dropdownElement,
                                handleSelect: (e: any) => {}
                            }))}
                            parentView={true}
                        />
                    }
                />
            </div>
            <div className='d-inline-flex'>
                <button className="btn btn-primary nabarbutton mx-4 my-2 d-none d-lg-block">Create</button>
                <button className="btn btn-primary nabarbutton mx-4 my-2 d-block d-lg-none">
                    <i className='bi bi-plus-lg'></i>
                </button>

            </div>
        </div>
    )
}

export default NavBarLinkList;