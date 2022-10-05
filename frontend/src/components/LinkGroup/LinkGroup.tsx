import { FC } from 'react';
import './LinkGroup.css';

export interface SimpleLink{
    label: string;
    value: string;
    to?: string;
}

interface LinkGroupProps{
    links: SimpleLink[];
    handleClick: (value: any) => void
}

const LinkGroup: FC<LinkGroupProps> = (props): JSX.Element => {
    return ( 
        <div  className="d-flex justify-content-center">
            { 
                props.links.map((link: SimpleLink, index: number ) =>(
                    <div className="ms-2 font-sm" key={`ling-group-item-${index}`}> 
                        <span>&#8226;</span>
                        <a className="ms-1" href={link.to || ''} onClick={link.to? ()=>{}: ()=>{props.handleClick(link.value)}}>{link.label}</a>
                    </div>
                    )
                )
            }
            
        </div>
    );
}

export default LinkGroup;