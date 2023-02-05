import { FC } from "react";

export interface BreadCrumbLink{
    label: string;
    href?: string;
}

interface BreadCrumb2Props{
    links: BreadCrumbLink[];
}

const BreadCrumb2: FC<BreadCrumb2Props> = (props) => {
    return (
        <div className='d-flex flex-nowrap py-3 text-grey'>
            {
                props.links.map((item, index) => (
                    <a className='me-2 no-link text-muted' key={`bread-curmb-item-${index}`} href={item.href}>    
                        <span className='crumb-link'>{item.label} </span><span>/</span>
                    </a>
                ))
            }
        </div>
    )
}

export default BreadCrumb2;