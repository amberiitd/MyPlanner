import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Cascader from '../../Cascader/Cascader';
import NavBarLink from '../NavBarLink/NavBarLink';
import './NavBarLinkList.css';

interface NavBarLinkItem{
    id: string | number;
    label: string;
    value: string;
    dropdownElement: JSX.Element;
}
interface NavBarLinkListProps{
    items: NavBarLinkItem[];
    selectedItem: NavBarLinkItem;
}
const NavBarLinkList: FC<NavBarLinkListProps> = (props) => {
    const [cuttOff, setCuttOff] = useState(0);
    const [moreLinks, setMoreLinks] = useState([]);
    const resize = useCallback(() => {
        const MAX_ALLOWED_WIDTH = 900;
        const AVG_LINK_WIDTH = 80;
        if (window.innerWidth > MAX_ALLOWED_WIDTH){
            setCuttOff(0);
            return;
        }
        const newCutOff = Math.ceil((MAX_ALLOWED_WIDTH - window.innerWidth)/AVG_LINK_WIDTH);
        if (newCutOff !== cuttOff){
            setCuttOff(Math.min(newCutOff, props.items.length));
        }
    }, [cuttOff]);
    useEffect(()=>{
        resize();
        window.addEventListener('resize', resize)
    }, [])
    return (
        <div className='d-inline-flex h-100 align-items-center'>
            { 
                props.items.slice(0, props.items.length - cuttOff).map( (item, index) => (
                    <NavBarLink key={`navlink-${index}`} 
                        label={item.label}
                        isActive={item.id === props.selectedItem.id}
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
        </div>
    )
}

export default NavBarLinkList;