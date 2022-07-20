import './LinkGroup.css';

export interface SimpleLink{
    label: string;
    to: string;
}

interface LinkGroupProps{
    links: SimpleLink[];
}

const LinkGroup = (props: any): JSX.Element => {
    return ( 
        <div  className="d-flex justify-content-center">
            { 
                props.links.map((link: SimpleLink, index: number ) =>(
                    <div className="ms-2 font-sm" key={`ling-group-item-${index}`}> 
                        <span>&#8226;</span>
                        <a className="ms-1" href={link.to}>{link.label}</a>
                    </div>
                    )
                )
            }
            
        </div>
    );
}

export default LinkGroup;